

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
var path = require('path')
var nodemailer = require('nodemailer');
const { response } = require("express");
const { get } = require("http");



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
        let pathToFile = path.join(__dirname, '..', '..', 'excels/Questions/Tab.csv');
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

const randomNumberBetween = (min, max) => {
    return Math.floor(
        Math.random() * (max - min) + min
    )
}
module.exports = router;

