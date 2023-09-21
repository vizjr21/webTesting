const pool = require('../database')
let axios = require('axios').default;

async function handleRide(req, res, next) {
    const con = await pool.getConnection();
    try {
        await con.beginTransaction(); 

        let duplicate = await axios.get(`/ride`, {params: req.body, connection: con, type: 'findDuplicate'}); 

        let match = await axios.get(`/ride`, {params: req.body, connection: con, type: 'findMatch'}); // modify so it sends to matching version 

        if (!(duplicate || match)) {
            await axios.post(`/ride`, {params: req.body, connection: con, type: 'new'});
            await con.commit(); 
            return res.send(`Your ride has been submitted. We will text you with a match.`)
        } else if (!duplicate && match){
            await axios.post(`/ride`, {params: req.body, connection: con, type: 'match'});
            await con.commit(); 
            return res.send(`You've matched with someone!`)
        } else {
            
        }
        
        
    } catch(err) {
        await con.rollback();
        return res.status(400).send({message: `An error has occurred.`}); 
    } finally {
        con.release;
    }
}

module.exports = {handleRide}