const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const paths = require('../config/paths');
const app = express();
const env = require('../config/env');
const PORT = env.PORT || 3003;
const { provaRoute } = require("../src/routes/provaRoute");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', provaRoute);


app.listen(PORT, () => {
    console.log(`Server avviato su http://localhost:${PORT}`);
});