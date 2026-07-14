const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();

const routes = require('./routes');

app.use(express.json());
app.use(cookieParser());

app.use(routes)

module.exports = app;