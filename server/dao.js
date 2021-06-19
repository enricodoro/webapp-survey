'use strict'
const bcrypt = require('bcrypt')
const sqlite = require('sqlite3')

const db = new sqlite.Database('survey.db', (err) => {
    if (err) throw err
})


exports.getAdmin = (username, password) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM admins WHERE username=?'
        db.get(sql, [username], (err, row) => {
            if (err)
                reject(err); //db error
            else if (row === undefined)
                resolve(false); //user not found
            else {
                bcrypt.compare(password, row.hash).then(result => {  //compare hash computed with the one stored
                    if (result)  // password hash matches
                        resolve({ id: row.id, username: row.username })
                    else
                        resolve(false)
                })
            }
        });
    });
}

exports.getAdminById = (id) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM admins WHERE id = ?';
        db.get(sql, [id], (err, row) => {
          if (err) 
            reject(err);
          else if (row === undefined)
            resolve({error: 'Admin not found.'});
          else {
            // by default, the local strategy looks for "username": not to create confusion in server.js, we can create an object with that property
            const user = {id: row.id, username: row.username }
            resolve(user);
          }
      });
    });
  };

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
}

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