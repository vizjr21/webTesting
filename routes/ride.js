const express = require('express');
const router = express.Router();

const {getRides, postRides} = require('../queries/ride');

router.route('/ride')
    .get(getRides)
    .post(postRides);

module.exports = router;