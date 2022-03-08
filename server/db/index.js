const mysql = require('mysql');
const md5 = require('md5')
const fs = require('fs');
const QRCode = require('qrcode');
var path = require('path');
var csv = require("csvtojson");
const converter = require('json-2-csv');
const utf8 = require('utf8');
var crypto = require('crypto');
const base64url = require('base64url');
// const poolProd = mysql.createPool({
//     connectionLimit: 100000,
//     // host: 'localhost',
//     host: 'localhost',
//     user: 'acventis',
//     password: 'HtZgmf554-87av',
//     database: 'arasco',
//     port: '3306'
// });


const poolProd = mysql.createPool({
    connectionLimit: 100000,
    // host: 'localhost',
    host: '85.214.108.28',
    user: 'uni',
    password: 'El2!21fw',
    database: 'MultiLearn',
    port: '3306'
});

// CREATE USER 'acventis'@'localhost' IDENTIFIED BY 'HtZgmf554-87av';

// GRANT ALL PRIVILEGES ON * . * TO 'acventis'@'localhost';
// const poolProd = mysql.createPool({
//     connectionLimit: 100000,
//     // host: 'localhost',
//     host: '176.94.98.234',
//     user: 'acvuser',
//     password: 'pFvADe2fjUZ4A5RELF',
//     database: 'acv',
//     port: '3306'
// });

const moment = require('moment');
moment.locale('de');
// const pool = poolDev
const pool = poolProd

pool.on('connection', function (connection) {
    console.log('DB Connection established');

    connection.on('error', function (err) {
        throw Error(err)

    });
    connection.on('close', function (err) {
        console.error(new Date(), 'MySQL close', err);
    });
});
const { json } = require('body-parser');

const randomNumberBetween = (min, max) => {
    return Math.floor(
        Math.random() * (max - min) + min
    )
}

const generateSALT = (length) => {
    return toFixedd(Math.floor(Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1)));
}

function toFixedd(x) {
    if (Math.abs(x) < 1.0) {
        var e = parseInt(x.toString().split('e-')[1]);
        if (e) {
            x *= Math.pow(10, e - 1);
            x = '0.' + (new Array(e)).join('0') + x.toString().substring(2);
        }
    } else {
        var e = parseInt(x.toString().split('+')[1]);
        if (e > 20) {
            e -= 20;
            x /= Math.pow(10, e);
            x += (new Array(e + 1)).join('0');
        }
    }
    return x;
}


let goDB = {};
//  -------------------------------------------------------------
//------------------------------IIS------------------------------
//  ------------------------------------------------------------

goDB.validateSessionTokenAndGetRole = (sessionToken, uuid) => {
    console.log(sessionToken, uuid)
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * FROM User WHERE SessionToken = ? AND uuid = ? `, [sessionToken, uuid], async (err, users) => {
            if (err) {
                console.log(err)
                reject({ successfull: false, msg: err });
            } else {
                if (users.length !== 0) {
                    resolve(users[0].role)
                } else {
                    resolve(undefined)
                }
            }
        })
    })
}

goDB.getUser = (sessionToken, uuid) => {

    return new Promise(async (resolve, reject) => {
        const role = await goDB.validateSessionTokenAndGetRole(sessionToken, uuid)
        if (role === 'ADMIN') {
            pool.query(`SELECT * FROM User`, async (err, users) => {
                if (err) {
                    reject({ successfull: false, msg: err });
                } else {
                    resolve(users)
                }
            })
        } else {
            reject({ err: 'userNotAuthorized' })
        }
    })
}


goDB.login = (body) => {
    return new Promise((resolve, reject) => {
        const psw = body.Password;
        const username = body.Username.trim().toLowerCase();
        console.log(psw)
        console.log(username)
        pool.query(`SELECT * FROM User WHERE username = ? `, [username], async (err, users) => {
            if (err) {
                console.log(err)
                reject({ successfull: false, msg: err });
            }

            if (users.length !== 0) {
                const pswFromDatabase = users[0].password
                const pswFromRequest = md5(md5(psw) + users[0].salt)
                const sessionToken = await getSessionToken()

                if (pswFromDatabase === pswFromRequest) {
                    pool.query(`UPDATE User SET SessionToken = ?  WHERE username = ? `, [sessionToken, username], (err, results) => {

                        resolve({ successfull: true, user: { uuid: users[0].uuid, role: users[0].role, username: users[0].username, ID: users[0].ID }, sessionToken: sessionToken });
                    })

                } else {
                    resolve({ successfull: false });
                }
            } else {
                resolve({ successfull: false });
            }
        });
    })
}

goDB.registerUser = (body, sessionToken, uuid) => {
    return new Promise(async (resolve, reject) => {
        const role = await goDB.validateSessionTokenAndGetRole(sessionToken, uuid)
        console.log(role)
        if (role === 'ADMIN') {
            const uuid = createUuidv4()
            const salt = randomNumberBetween(1000, 9999);
            const psw = md5(`${md5(body.password)}${salt}`)
            const username = body.username.trim().toLowerCase();
            pool.query(`insert into User( uuid, username, password, salt, role) values (?,  ?, ?, ?, ? )`, [uuid, username, psw, salt, body.Role], (err, results) => {
                if (err) {

                    if (err.errno === 1062) {
                        if (err.sqlMessage.includes('username')) {
                            return resolve({ err: 'Nutzer bereits angelegt' })
                        }
                        goDB.registerUser(body)
                    } else {
                        console.log('-----#-#-#-#-', err)
                        return resolve({ err: err.errno })
                    }
                }
                resolve(results)
            })
        } else {
            reject({ err: 'userNotAuthorized' })
        }
    });
}

goDB.changePassword = (body, sessionToken, uuid) => {
    return new Promise(async (resolve, reject) => {
        const role = await goDB.validateSessionTokenAndGetRole(sessionToken, uuid)
        console.log('######', role, 'PSW')
        if (role === 'ADMIN') {
            const salt = randomNumberBetween(1000, 9999);
            const psw = md5(`${md5(body.password)}${salt}`)
            pool.query(`UPDATE User SET password = ?, salt = ? WHERE uuid = ? `, [psw, salt, body.uuid], (err, results) => {
                if (err) {
                    console.log(err)
                    return reject(err.errno)
                }
                resolve(results)
            })
        } else {
            reject({ err: 'userNotAuthorized' })
        }
    });
}

goDB.changeRole = (body, sessionToken, uuid) => {
    return new Promise(async (resolve, reject) => {
        const role = await goDB.validateSessionTokenAndGetRole(sessionToken, uuid)
        console.log('######', role)
        console.log('######', role)
        if (role === 'ADMIN') {
            pool.query(`UPDATE User SET Role = ? WHERE uuid = ? `, [body.Role, body.uuid], (err, results) => {
                if (err) {
                    console.log(err)
                    return reject(err.errno)
                }
                resolve(results)
            })
        } else {
            reject({ err: 'userNotAuthorized' })
        }
    });
}


goDB.getRandomQuestion = (sessionToken, uuid) => {
    return new Promise(async (resolve, reject) => {
        const role = await goDB.validateSessionTokenAndGetRole(sessionToken, uuid)
        if (role !== undefined) {

            let questions = await goDB.ReadCSVAndSaveQuestions(sessionToken, uuid)
            let randomNumber = randomNumberBetween(0, questions.length - 1);
            resolve({ ...questions[randomNumber] })
        } else {
            reject({ err: 'userNotAuthorized' })
        }
    });
}

goDB.saveQuestion = (body) => {
    return new Promise(async (resolve, reject) => {

        pool.query(`insert into Question( format, body, additionalText, options,  correctOptions, multiple, abstentionsAllowed, image, topic) values (?, ?, ?, ? , ? , ?, ?, ?,?  )`,
            [body.format, body.body, body.additionalText, JSON.stringify(body.options), body.correctOptions, body.multiple, body.abstentionsAllowed, body.image, body.topic], (err, results) => {
                if (err) {
                    console.log('#####.....####', err)
                }
                resolve(results)
            })
    });
}

goDB.saveResult = (sessionToken, uuid, body) => {
    return new Promise(async (resolve, reject) => {
        const role = await goDB.validateSessionTokenAndGetRole(sessionToken, uuid)
        if (role !== undefined) {
            goDB.getOpenQuestions(sessionToken, uuid).then(res => {
                pool.query(`insert into answeredQuestions( Question, User, Result) values (?, ?, ?)`,
                    [body.Question, uuid, body.Result], (err, results) => {
                        if (err) {
                            console.log('#####.....####', err)
                        }
                        resolve(results)
                    })
            })
        } else {
            reject({ err: 'userNotAuthorized' })
        }
    });
}

goDB.getAllQuestions = (sessionToken, uuid) => {
    return new Promise(async (resolve, reject) => {
        const role = await goDB.validateSessionTokenAndGetRole(sessionToken, uuid)
        if (role !== undefined) {
            pool.query(`select * from Question `, (err, results) => {
                if (err) {
                    console.log('#####.....####', err)
                }
                resolve(results.map(question => { return { ...question, options: JSON.parse(question.options) } }))
            })
        } else {
            reject({ err: 'userNotAuthorized' })
        }
    });
}

goDB.getTopics = (sessionToken, uuid) => {
    return new Promise(async (resolve, reject) => {
        const role = await goDB.validateSessionTokenAndGetRole(sessionToken, uuid)
        if (role !== undefined) {
            pool.query(`select * from Question`, (err, results) => {
                if (err) {
                    console.log('#####.....####', err)
                }
                let topics = []
                results.forEach(quest => {
                    const foundTopic = topics.find(topic => topic === quest.topic)
                    if (!foundTopic) {
                        topics.push(quest.topic)
                    }
                })
                resolve(topics)
            })
        } else {
            reject({ err: 'userNotAuthorized' })
        }
    });
}

goDB.getOpenQuestions = (sessionToken, uuid, topic) => {
    return new Promise(async (resolve, reject) => {
        const role = await goDB.validateSessionTokenAndGetRole(sessionToken, uuid)
        if (role !== undefined) {
            pool.query(`SELECT Question.*, answeredQuestions.Result AS Result, answeredQuestions.User AS User,  answeredQuestions.TimeStamp AS TimeStamp,  answeredQuestions.ID AS AnsweredID
            FROM Question 
            LEFT JOIN answeredQuestions ON Question.ID = answeredQuestions.Question 
            LEFT JOIN User ON User.uuid = answeredQuestions.User 
            ${topic !== undefined ? 'WHERE Question.topic = ?' : ''}`, [topic], (err, results) => {
                if (err) {
                    console.log('#####.....####', err)
                }
                let notAnsweredQuestions = results.filter(quest => {
                    return quest.User === null
                });
                let wrongAnsweredQuestions = results.filter(quest => {
                    return quest.Result === 0
                });
                let rightAnsweredQuestions = results.filter(quest => {
                    return (quest.Result !== null && quest.Result === 1)
                });
                const allAnsweredQuestions = wrongAnsweredQuestions.concat(rightAnsweredQuestions)
                let questions = []
                allAnsweredQuestions.forEach(quest => {
                    const foundQuestion = questions.find(question => question.ID === quest.ID)
                    if (!foundQuestion) {
                        questions.push({ question: quest, ID: quest.ID, wrongCount: quest.Result === 0 ? 1 : 0, right: quest.Result === 1 ? 1 : 0 })
                    } else {
                        foundQuestion.wrongCount = quest.Result === 0 ? foundQuestion.wrongCount + 1 : foundQuestion.wrongCount
                        foundQuestion.rightCount = quest.Result === 1 ? foundQuestion.rightCount + 1 : foundQuestion.rightCount
                    }
                })
                questions.forEach(question => {
                    let foundAnsweredQuestions = allAnsweredQuestions.filter(quest => quest.ID === question.ID)
                    if (foundAnsweredQuestions.length !== 0) {
                        foundAnsweredQuestions.sort(function (a, b) {
                            return new Date(b.TimeStamp) - new Date(a.TimeStamp);
                        });
                    }
                    question.latestResult = !!foundAnsweredQuestions[0].Result
                })
                resolve({ notAnsweredQuestions: parseQuestionOptions(notAnsweredQuestions), answered: questions })
            })
        } else {
            reject({ err: 'userNotAuthorized' })
        }
    });
}

function parseQuestionOptions(questions) {
    return questions.map(question => { return { ...question, options: JSON.parse(question.options) } })
}

goDB.ReadCSVAndSaveQuestions = () => {
    return new Promise(async (resolve, reject) => {
        var filePath = path.join(__dirname, '..', '..', 'excels/Questions/Tab.csv')
        var csv = fs.readFileSync(filePath, { encoding: 'utf16le' },
            function (err) { console.log(err); });

        converter.csv2json(csv, async (err, json) => {
            if (err) {
                console.log(err)
                reject({ successfull: false, msg: err })
            }

            let jsonToReturn = renameKey(json)
            let jsonToReturn2 = extractImage(jsonToReturn)
            let jsonToReturn3 = extractTopic(jsonToReturn2)
            let jsonToReturn4 = extractUnusedCharacters(jsonToReturn3)
            let jsonToReturn5 = extractOptions(jsonToReturn4)

            let promisses = []
            jsonToReturn5.forEach(async question => {
                promisses.push(goDB.saveQuestion(question))
            })
            try {
                let allQuestions = await Promise.all(promisses)
                resolve('')
            } catch (e) {
                console.log(e)
            }

        }, { delimiter: { field: '\t', excelBOM: true } });

    });
}

function extractImage(json) {
    json.forEach(obj => {
        let imageContainer = obj.body.match(/\[\](.*)\n/)
        if (imageContainer !== null) {
            // console.log(imageContainer[1])
            let imageString = imageContainer[1].match(/\((.*) \"autoxautoxleft\"\)/)
            obj.image = imageString[1]
            obj.body = obj.body.replace(imageContainer[0], '')
        }
    })
    return json
}

function extractOptions(json) {
    json.forEach(obj => {
        let options = obj.options.split('\n')
        obj.options = options
    })
    return json
}

function extractUnusedCharacters(json) {
    json.forEach(obj => {
        obj.body = obj.body.replace(/\n!/g, '')
            .replace(/\n/g, '')
    })
    return json
}

function extractTopic(json) {
    json.forEach(obj => {
        let topicContainer = obj.body.match(/\*\*(.*)\*\*/)

        if (topicContainer !== null) {

            obj.topic = topicContainer[1]
            obj.body = obj.body.replace(topicContainer[0], '')
        }
    })
    return json
}

function renameKey(json) {
    let keyToRename = Object.keys(json[0])[0]
    json.forEach(obj => {
        obj['format'] = obj[keyToRename];
        delete obj[keyToRename];
    })
    return json
}

const createUuidv4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
const createGTIN = (GTIN) => {

    if (`${GTIN}`.trim().toLocaleLowerCase().includes('e+')) {

    }
}


const getSessionToken = () => {
    return new Promise((resolve, reject) => {
        require('crypto').randomBytes(48, function (err, buffer) {
            resolve(buffer.toString('hex'))
        });
    });
}

module.exports = goDB;

