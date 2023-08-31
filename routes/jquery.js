const express = require('express');
const router = express.Router();

router.route('/')
    .get((req, res) => {
        res.render('index');
    })
    .post((req, res) => {
        setTimeout(function() {
            res.send(`<h1>res send is working</h1>`);
        }, 4000); 
    });

module.exports = router;