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
      const sql = 'SELECT * FROM ADMINS WHERE id = ?';
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
        const sql = 'SELECT * FROM SURVEYS WHERE sID=?'
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
        const sql = 'SELECT * FROM QUESTIONS WHERE sID=? ORDER BY qID'
        db.all(sql, [id], (err, rows) => {
            if(err){
                reject(err)
                return;
            }
            resolve(rows)
        })
    })
}

exports.loadOfferedAnswers = (sID, qID) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM OFFERED_ANSWERS WHERE qID=? AND sID=? ORDER BY aID'
        db.all(sql, [qID, sID], (err, rows) => {
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
        const sql = 'SELECT * FROM GIVEN_ANSWERS WHERE sID=? ORDER BY id'
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
        const sql = 'SELECT * FROM USERS WHERE sID=? ORDER BY uID'
        db.all(sql, [id], (err, rows) => {
            if(err){
                reject(err)
                return;
            }
            resolve(rows)
        })
    })
}

exports.addUser = (user) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO USERS (username, sID) VALUES (?, ?)'
        db.run(sql, [user.username, user.sID],
            (err) => {
              if (err) {
                reject(err);
              }
              resolve(this.lastID)
            }
          )
    })
}
