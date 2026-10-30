const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const dotenv = require('dotenv');
const app = express();
const config = require('../config/env');
const paths = require('../config/paths');
const authRoute = require('./routes/auth');
const pageRoute = require('./routes/pageroute');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/', authRoute); 
app.use('/', pageRoute);
app.use(express.static(paths.PUBLIC));

app.listen(config.AUTHSERVER_PORT, () => {
    console.log(`Service 2 (API) avviato su http://localhost:${config.AUTHSERVER_PORT}/api/v1/auth`);
});