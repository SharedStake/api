const express = require('express');
const path = require('path');

const app = express();
const api = require('./api')

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//api routes
app.use('/api', api)

app.get('/', (req, res) => {
    res.send('hello!');
});

app.all('*', (req, res, next) => {
    res.status(404).json({ status: 'fail', msg: "This Page is not exist" })
});

module.exports = app