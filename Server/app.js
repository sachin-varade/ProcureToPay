"use strict";

var express = require("express");
var bodyParser = require('body-parser');
var app = express();
var router = require("./routes/routes");
var cors = require("cors");
// var formidable = require('express-formidable');
// app.use(formidable({
//     encoding: 'utf-8',
//     uploadDir: './',
//     multiples: true, // req.files to be arrays of files 
// }));
const fileUpload = require('express-fileupload');
app.use(fileUpload());

// Enable CORS preflight across the board.
app.options("*", cors());
app.use(cors());

// Add headers
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use('/api', router);
var port = process.env.PORT || 8081;       
app.listen(port);
console.log('API Running on port ' + port);