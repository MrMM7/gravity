const express = require('express');
const app = express();
const fs = require('fs');

const homepage = fs.readFileSync('./static/index.html', 'utf8');

app.use(express.json())

const linkRoutes = require('./routes/linkRoutes');

app.get('/', (req, res) => {
    res.header({
        "Content-Type": "text/html",
    })
    res.send(homepage);
})
app.use(linkRoutes)

module.exports = app;