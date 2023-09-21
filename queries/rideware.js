const pool = require('../database');


// form validation code 

async function dbConnect(req, res, next) {
    try {
        
        req.db = await pool.getConnection(); 
        next();  
    } catch (err) {
        // await req.db.release(); 
        next(err); 
    }
}

async function startTransaction(req, res, next) {
    try {

        const con = req.db;
        
        await con.beginTransaction(); 
        next(); 
    } catch(err) {
        next(err);
    }
}

async function getUser2(req, res, next) {
    try { 
        const con = req.db; 

        const user = await con.execute(`SELECT id, first_name, surname, phone_number FROM users WHERE id = ?
        FOR UPDATE`, [req.oidc.user.email]);
        
        req.user = user[0][0];
    
        next(); 
    } catch(err) {
        next(err); 
    }
}

async function getEvent3(req, res, next) {
    try {
        const con = req.db; 

        const event = await con.execute(`SELECT id FROM events WHERE id > 20`); 

        req.event = event[0][0];

        next();
    } catch (err) {
        next(err); 
    }
}

async function endTransaction(req, res, next) {
    try {
        const con = req.db;

        await con.commit(); 

        res.send([req.event, req.user]); 
        return next(); 
    } catch(err) {
        await con.rollback(); 
        next(err);
    }
}

function testNext(req, res, next) {
    console.log('testing'); 
}

async function errors(err, req, res, next) {
    if (res.headersSent) {
        return next(err)
    }
    console.log('an error has occurred')
    res.render('An error has occurred.')
}

async function transformReqBody(req, res, next) {
    try {
        let con = res.locals; 
        const event_id = stringToNumber(req.body.event[0] || undefined);

        const route_id = await con.execute(`SELECT routes.id AS route_id FROM routes 
        INNER JOIN locations
        ON routes.pickup_location = locations.id
        WHERE event_id = ? AND pickup_location = ? LIMIT 1 FOR UPDATE`, [event_id || null, req.body.pickup_location || null]);
       
        const bodyTransform = Object.freeze({
            route_id: route_id[0][0].route_id || undefined,
            pickup_time: req.body.pickup_time || undefined,
            return_time: (req.body.return_time) ? body.return_time : '00:00:00',
            pickup_location: req.body.pickup_location || undefined,
            roundtrip: stringToBoolean(req.body.radio_button) || undefined, // could be a bug: if 0, it would return undefined, meaning SQL will fail
            seats: req.body.seats || undefined,
            email: req.oidc.user.email || undefined,
            first_name: req.body.first_name || undefined,
            surname: req.body.surname || undefined,
            phone_numbr: req.body.phone|| undefined,
            photo_filepath: req.file.filename || undefined
        });
    
        req.body = bodyTransform;

    } catch(err) {
        return err;
    }
}

module.exports = {dbConnect, startTransaction, getUser2, getEvent3, endTransaction, testNext, errors, transformReqBody}