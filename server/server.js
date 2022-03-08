//Import module
const express = require('express');
const app = express();
const mysql = require('mysql');
const fileUpload = require('express-fileupload');
// const engines = require("consolidate");
const apiRouter = require('./routes');
const bodyParser = require('body-parser')
var session = require('express-session');
var path = require('path');
var cors = require("cors");
const TWO_HOURS = 1000 * 60 * 60 * 2
app.use(cors());
app.use(fileUpload());
app.use(express.json());
app.use('/', apiRouter);

app.listen(process.env.PORT || '8080', () => {
	console.log(`Server is running on port: ${process.env.PORT || '8080'}`);
});




