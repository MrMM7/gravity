const fs = require('fs');
const express = require('express');

const app = express();

const homePage = fs.readFileSync(`${__dirname}/static/index.html`, 'utf8');
const authPage = fs.readFileSync(`${__dirname}/static/auth.html`, 'utf8');

app.get('/', (req, res) => {
    res.header({
        "Content-Type": "text/html",
    })
    res.send(homePage);
})

app.get('/auth', (req, res) => {
    res.header({
        "Content-Type": "text/html",
    })
    res.send(authPage);
})

module.exports = app;