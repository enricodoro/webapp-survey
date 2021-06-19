'use strict'

const sqlite = require('sqlite3')

const db = new sqlite.Database('survey.db', (err) => {
    if (err) throw err
})

exports.loadSurveys = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM surveys'
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
        const sql = 'SELECT * FROM surveys, admins WHERE surveys.adminId=admins.id AND admins.username=?'
        db.all(sql, [admin], (err,rows) => {
            if(err){
                reject(err)
                return;
            }
            resolve(rows)
        })
    })
}
exports.loadSurvey = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM surveys WHERE surveyId=?'
        db.get(sql, [id], (err, row) => {
            if(err){
                reject(err)
                return;
            }
            resolve(row)
        })
    })
}
exports.loadQuestions = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM questions WHERE surveyId=?'
        db.all(sql, [id], (err, rows) => {
            if(err){
                reject(err)
                return;
            }
            resolve(rows)
        })
    })
}

exports.loadOfferedAnswers = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM offered_answers WHERE questionId=?'
        db.all(sql, [id], (err, rows) => {
            if(err){
                reject(err)
                return;
            }
            resolve(rows)
        })
    })
exports.loadAnswers = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM given_answers WHERE surveyId=? ORDER BY idUser'
        db.all(sql, [id], (err, rows) => {
            if(err){
                reject(err)
                return;
            }
            resolve(rows)
        })
    })
}

exports.loadUsers = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT DISTINCT id, username FROM given_answers, users WHERE given_answers.surveyId=? AND given_answers.idUser=users.id ORDER BY users.id'
        db.all(sql, [id], (err, rows) => {
            if(err){
                reject(err)
                return;
            }
            resolve(rows)
        })
    })
}