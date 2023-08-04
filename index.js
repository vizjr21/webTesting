
let express = require('express');
let bp = require('body-parser');
let axios = require('axios').default;

let app = express();

app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

let pool = require('./database')

app.route('/')
    .get((req, res) => {
        res.render('index');
    })
    .post((req, res) => {
        
        setTimeout(function() {
            res.send(`<h1>res send is working</h1>`);
        }, 4000); 

    })

app.route('/axios')
    .get((req, res) => {
        res.render('axios');
    })
    .post((req, res) => { 
        setTimeout(function() {
            res.send(`Axios message: ${req.body.text}. It works!`);
        }, 3000);
    })
// what about event emitter while maintaining state of matching algorithm

app.listen(5000);

