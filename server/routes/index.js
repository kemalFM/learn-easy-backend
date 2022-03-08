

const express = require("express");
const db = require("../db");
const router = express.Router();
var path = require('path');
const docx = require('docx-templates');
const fs = require('fs');
const https = require('https');

const moment = require('moment');
const fetch = require('node-fetch');
moment.locale('de');
var base64 = require('node-base64-image');
var crypto = require('crypto');
const base64url = require('base64url');
const docxConverter = require('docx-pdf');
var axios = require('axios');
// var admin = require('firebase-admin');
var CloudmersiveConvertApiClient = require('cloudmersive-convert-api-client');
var CloudmersiveBarcodeapiClient = require('cloudmersive-barcodeapi-client');
var defaultClient = CloudmersiveConvertApiClient.ApiClient.instance;
var Apikey = defaultClient.authentications['Apikey'];
Apikey.apiKey = 'f2cea0f4-2e2e-4e6e-b649-dc4b65d4680f';
var apiInstance = new CloudmersiveConvertApiClient.ConvertDocumentApi();

var qrCodeApi = CloudmersiveBarcodeapiClient.ApiClient.instance;
var ApikeyQR = qrCodeApi.authentications['Apikey'];
ApikeyQR.apiKey = 'f2cea0f4-2e2e-4e6e-b649-dc4b65d4680f';
var apiInstanceQR = new CloudmersiveBarcodeapiClient.GenerateBarcodeApi();


var path = require('path')
var nodemailer = require('nodemailer');
const { response } = require("express");
let transporter = nodemailer.createTransport({
    name: 'smtp.ionos.de',
    host: 'smtp.ionos.de',
    port: 587,
    auth: {
        user: 'befund@ratingen.coronatest-rheinland.de ',
        pass: 'h7hx8iI#00678ui!v54k1'
    }
});



//AUTHENTIFICATION

router.post("/:sessionToken/:uuid/registerUser", async (req, res, next) => {
    try {
        var results = await db.registerUser(req.body, req.params.sessionToken, req.params.uuid);
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

router.post("/login", async (req, res, next) => {
    try {
        console.log('######')
        var results = await db.login(req.body);
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

router.post("/:sessionToken/:uuid/saveResult", async (req, res, next) => {
    try {
        var results = await db.saveResult(req.params.sessionToken, req.params.uuid, req.body);
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

router.get("/:sessionToken/:uuid/getUser", async (req, res, next) => {
    try {
        var results = await db.getUser(req.params.sessionToken, req.params.uuid);
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

router.get("/", async (req, res, next) => {
    try {
        // var results = await db.getUser(req.params.sessionToken, req.params.uuid);
        res.json({ works: true });
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

router.get("/:sessionToken/:uuid/getRandomQuestion", async (req, res, next) => {
    try {
        db.getRandomQuestion(req.params.sessionToken, req.params.uuid).then(response => {
            console.log(response)
            res.json(response)
        }).catch(err => { console.log(err); res.json(err) })
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

router.get("/:sessionToken/:uuid/getTopics", async (req, res, next) => {
    try {
        db.getTopics(req.params.sessionToken, req.params.uuid).then(response => {
            console.log(response)
            res.json(response)
        }).catch(err => { console.log(err); res.json(err) })
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

router.get("/:sessionToken/:uuid/getOpenQuestions/:topic?", async (req, res, next) => {
    try {
        db.getOpenQuestions(req.params.sessionToken, req.params.uuid, req.params.topic).then(response => {
            res.json(response)
        }).catch(err => { console.log(err); res.json(err) })
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

router.get("/getExcelExample", async (req, res, next) => {
    try {
        let pathToFile = path.join(__dirname, '..', '..','excels/Questions/Tab.csv' ); 
        res.attachment('Tab.csv').send(fs.readFileSync(pathToFile))
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

router.get("/:sessionToken/:uuid/getAllQuestions", async (req, res, next) => {
    try {
        db.getAllQuestions(req.params.sessionToken, req.params.uuid).then(response => {
            res.json(response)
        }).catch(err => { console.log(err); res.json(err) })
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

router.post("/uploadQuestions", async (req, res, next) => {
    try {
        var filePath = path.join(__dirname, '..', '..', `excels/Questions/Tab.csv`)
        var filePath1 = path.join(__dirname, '..', '..', `excels/Questions/Tab.csv`)

        if (req.files && req.files.file && req.files.file.mimetype === 'text/csv') {
            fs.unlink(filePath, async (err) => {
                try {
                    await fs.writeFileSync(filePath1, req.files.file.data)
                    let allQuestions = await db.ReadCSVAndSaveQuestions()
                    res.json({ msg: 'Erfolgreich hochgeladen' })
                } catch (err) {
                    console.log(err)
                    res.json({ msg: 'Es ist ein Fehler aufgetreten', err: err })
                }
            })
        } else {
            res.json({ msg: 'Die Datei hat das falsche Format. Bitte laden Sie eine csv hoch' })
        }
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

router.get("/upload", async (req, res, next) => {
    try {
        res.sendFile(path.join(__dirname, '..', '..', `src/excelUpload/excelUpload.html`));
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

router.post("/:sessionToken/:uuid/changePassword", async (req, res, next) => {
    try {
        var results = await db.changePassword(req.body, req.params.sessionToken, req.params.uuid);
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

router.post("/:sessionToken/:uuid/changeRole", async (req, res, next) => {
    try {
        var results = await db.changeRole(req.body, req.params.sessionToken, req.params.uuid);
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

//ADDITIONAL FUNCTIONS 

createQrImage = (testID) => {
    return new Promise(async (resolve, reject) => {
        try {
            let image = await axios.get(`https://chart.googleapis.com/chart?cht=qr&chl=${'https://ratingen-backend.ctcr.de/validate/' + testID}&chs=50x50&chld=L|0`, { responseType: 'arraybuffer' });
            let raw = Buffer.from(image.data).toString('base64');
            resolve("data:" + image.headers["content-type"] + ";base64," + raw)
        } catch (err) {
            resolve('')
        }
    })
}

createQrImageCWA = (link) => {
    return new Promise(async (resolve, reject) => {
        if (link !== null) {
            var callback = function (error, data, response) {
                if (error) {
                    console.error("ERROR QRCODEGENERATOR: ", error.message);
                    resolve('')
                } else {
                    console.log('API successfully called')
                    let raw = Buffer.from(data).toString('base64');
                    resolve("data:" + 'image/png' + ";base64," + raw)
                    // resolve(raw)
                }
            };

            apiInstanceQR.generateBarcodeQRCode(link, callback);
        } else { resolve(undefined) }
    })
}


const randomNumberBetween = (min, max) => {
    return Math.floor(
        Math.random() * (max - min) + min
    )
}
module.exports = router;

