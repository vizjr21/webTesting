const express = require('express');
const router = express.Router();

let {dbConnect, startTransaction, getUser2, getEvent3, errors, endTransaction, testNext, transformReqBody} = require('../queries/rideware')

router.route('/rideware')
    .get(dbConnect, startTransaction, getUser2, getEvent3, endTransaction, testNext);

module.exports = router; 