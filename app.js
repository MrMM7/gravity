const fs = require('fs');
const express = require('express');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

const app = express();
dotenv.configDotenv({
    path: '.env',
    quiet: true,
});

const homePage = fs.readFileSync('./static/index.html', 'utf8');
const authPage = fs.readFileSync('./static/auth.html', 'utf8');

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));

const linkRoutes = require('./routes/linkRoutes');
const authenticationRoutes = require('./routes/authRoutes');

const verifySession = require('./middlewares/auth');

app.get('/', verifySession, (req, res) => {
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

app.use(linkRoutes)
app.use('/api', authenticationRoutes)

module.exports = app;