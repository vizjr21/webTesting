
let express = require('express');
let bp = require('body-parser');
let axios = require('axios').default;

let app = express();

app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));
app.use("/public", express.static("public"));

app.set('view engine', 'ejs');

let pool = require('./database')

const axiosPage = require('./routes/axios');
const jqueryPage = require('./routes/jquery');
const handler = require('./routes/handler'); 
const ride = require(`./routes/ride`);
const rideware = require('./routes/middleware')

app.use(jqueryPage);
app.use(axiosPage);
app.use(handler);
app.use(ride);
app.use(rideware);

async function findDuplicate(req, res, next) {
    const con = await pool.getConnection(); 
    try {
        const offer = await con.execute(`SELECT COUNT(id) AS offer_id FROM offers
        WHERE driver_id = ? AND route_id = ? AND pickup_time = ? AND 
        return_time = ? AND roundtrip = ? LIMIT 1 FOR UPDATE`, Object.values(req.body));

        const request = await con.execute(`SELECT COUNT(id) AS request_id FROM requests
        WHERE passenger_id = ? AND route_id = ? AND pickup_time = ? AND 
        return_time = ? AND roundtrip = ? LIMIT 1 FOR UPDATE`, Object.values(req.body));

        const transaction = await con.execute(`SELECT CONNECTION_ID()`); 

        let response = {
            offer: offer[0][0].offer_id,
            request: request[0][0].request_id,
            transaction: transaction[0][0].CONNECTION_ID()
        }

        return response;

    } catch(err) {
        res.status(400).send({message: `An error has occurred.`})
    }
}

async function findMatch(req, res, next) {
    try {
        const con = await pool.getConnection(req.transaction) // not valid syntax
        const match = await con.execute(`SELECT id FROM requests 
        WHERE passenger_id != ? AND route_id = ? AND pickup_time = ? AND 
        return_time = ? AND roundtrip = ? LIMIT 1 FOR UPDATE`, Object.values(req.body)); 

        return match[0][0].id;

    } catch (err) {
        res.status(400).send({message: `An error has occured.`})
    }
    
}

app.listen(5000);
