const express = require('express');
const router = express.Router();

router.route('/axios')
    .get((req, res) => {
        res.render('axios');
    })
    .post((req, res) => {
        setTimeout(function() {
            res.send(`Axios message: ${req.body.text}. It works!`)
        }, 3000);
    })

module.exports = router; 