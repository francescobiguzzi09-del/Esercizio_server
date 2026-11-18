const express = require('express');
const config = require('../config/env');
const app = express();
const bodyParser = require('body-parser');
const saveDataRoute = require('./routes/saveDataRoute');
const searchDataRoute = require('./routes/searchDataRoute');
const userAuthRoute = require('./routes/userAutnRoute');
const cookieParser = require('cookie-parser');
const port = config.port || 3001;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use('/', saveDataRoute);
app.use('/', userAuthRoute);
app.use('/', searchDataRoute);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});




