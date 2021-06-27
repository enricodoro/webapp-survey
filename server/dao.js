'use strict'
const bcrypt = require('bcrypt')
const sqlite = require('sqlite3')

const db = new sqlite.Database('survey.db', (err) => {
    if (err) throw err
})


exports.getAdmin = (username, password) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM ADMINS WHERE username=?'
        db.get(sql, [username], (err, row) => {
            if (err)
                reject(err) //db error
            else if (row === undefined)
                resolve(false) //user not found
            else {
                bcrypt.compare(password, row.hash).then(result => {  //compare hash computed with the one stored
                    if (result)  // password hash matches
                        resolve({ id: row.id, username: row.username })
                    else
                        resolve(false)
                })
            }
        })
    })
}

exports.getAdminById = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM ADMINS WHERE id = ?'
        db.get(sql, [id], (err, row) => {
            if (err)
                reject(err)
            else if (row === undefined)
                resolve({ error: 'Admin not found.' })
            else {
                // by default, the local strategy looks for "username": not to create confusion in server.js, we can create an object with that property
                const user = { id: row.id, username: row.username }
                resolve(user)
            }
        })
    })
}

exports.loadSurveys = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM SURVEYS'
        db.all(sql, (err, rows) => {
            if (err) {
                reject(err)
                return
            }
            resolve(rows)
        })
    })
}

exports.loadAdminSurveys = (admin) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM SURVEYS, ADMINS WHERE SURVEYS.adminId=ADMINS.id AND ADMINS.username=?'
        db.all(sql, [admin], (err, rows) => {
            if (err) {
                reject(err)
                return
            }
            resolve(rows)
        })
    })
}

exports.loadSurvey = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM SURVEYS WHERE sID=?'
        db.get(sql, [id], (err, row) => {
            if (err) {
                reject(err)
                return
            }
            resolve(row)
        })
    })
}

exports.loadQuestions = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM QUESTIONS WHERE sID=? ORDER BY qID'
        db.all(sql, [id], (err, rows) => {
            if (err) {
                reject(err)
                return
            }
            resolve(rows)
        })
    })
}

exports.loadOfferedAnswers = (sID, qID) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM OFFERED_ANSWERS WHERE qID=? AND sID=? ORDER BY aID'
        db.all(sql, [qID, sID], (err, rows) => {
            if (err) {
                reject(err)
                return
            }
            resolve(rows)
        })
    })
}

exports.loadAnswers = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM GIVEN_ANSWERS WHERE sID=? ORDER BY id'
        db.all(sql, [id], (err, rows) => {
            if (err) {
                reject(err)
                return
            }
            resolve(rows)
        })
    })
}

exports.loadUsers = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM USERS WHERE sID=? ORDER BY uID'
        db.all(sql, [id], (err, rows) => {
            if (err) {
                reject(err)
                return
            }
            resolve(rows)
        })
    })
}

exports.addSurvey = (survey) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO SURVEYS (adminID, title, description, number_of_answers) VALUES (?, ?, ?, 0)'
        db.run(sql, [survey.adminID, survey.title, survey.description], function (err) {
            if (err) {
                reject(err)
                return
            }
            resolve(this.lastID)
        })
    })
}

exports.addQuestion = (question) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO QUESTIONS (sID, qID, title, open, min, max) VALUES (?, ?, ?, ?, ?, ?)'
        db.run(sql, [question.sID, question.qID, question.title, question.open, question.min, question.max],
            function (err) {
                if (err) {
                    reject(err)
                    return
                }
                resolve(question.qID)
            })
    })
}

exports.addAnswer = (answer) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO OFFERED_ANSWERS (sID, qID, aID, text) VALUES (?, ?, ?, ?)'
        db.run(sql, [answer.sID, answer.qID, answer.aID, answer.text],
            function (err) {
                if (err) {
                    reject(err)
                    return
                }
                resolve(true)
            })
    })
}

exports.addUser = (user) => {
    return new Promise((resolve, reject) => {
        const sql1 = 'INSERT INTO USERS (username, sID) VALUES (?, ?)'
        db.run(sql1, [user.username, user.sID],
            function (err) {
                if (err) {
                    reject(err)
                    return
                }
                let uID = this.lastID
                const sql2 = 'UPDATE SURVEYS SET number_of_answers=number_of_answers+1 WHERE sID=?'
                db.run(sql2, [user.sID], function (err) {
                    if (err) {
                        reject(err)
                        return
                    }
                    resolve(uID)
                })
            }
        )
    })
}

exports.addUserAnswer = (answer) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO GIVEN_ANSWERS (id, sID, qID, aID, text) VALUES (?, ?, ?, ?, ?)'
        db.run(sql, [answer.id, answer.sID, answer.qID, answer.aID, answer.text],
            function (err) {
                if (err) {
                    reject(err)
                    return
                }
                resolve(true)
            }
        )
    })
}
