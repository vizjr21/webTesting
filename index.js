
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

app.use(jqueryPage);
app.use(axiosPage);

app.listen(5000);
