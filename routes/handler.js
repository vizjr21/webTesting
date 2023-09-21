const express = require('express');
const router = express.Router();
const {handleRide} = require('../queries/handler')

router.route('/handler')
    .post(handleRide)


module.exports = router;