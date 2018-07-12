const express = require("express");
const path = require("path");
const fs = require("fs");
const cookieParser = require("cookie-parser");

global.CLIENT_ID = `${fs.readFileSync(`${process.env.HOME}/.corki/client_id`)}`.trim();
global.CLIENT_SECRET = `${fs.readFileSync(`${process.env.HOME}/.corki/client_secret`)}`.trim();

const app = express();

// support for cookies
app.use(cookieParser());

// catch errs
app.use((err, req, res, next) => {
    switch (err.message) {
        case 'NoCodeProvided':
            return res.status(400).send({
                status: 'ERROR',
                error: err.message,
            });
        default:
            return res.status(500).send({
                status: 'ERROR',
                error: err.message,
            });
    }
});

app.use('/', require('./pages/home'));
app.use('/', require('./pages/login'));

//
app.listen(5050, () => {
    console.info("portal running on port 5050");
});
