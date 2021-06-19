'use strict';

const express = require('express')
const morgan = require('morgan')
const { check, validationResult } = require('express-validator')
const dao = require('./dao')
const passport = require('passport')
const passportLocal = require('passport-local')
const session = require('express-session')

const PORT = 3001

const app = new express()

app.use(morgan('dev'))
app.use(express.json())
app.use(session({
  secret: 'session secret',
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

// get all surveys

app.get('/api/surveys', async (req, res) => {
  try {
    let surveys = await dao.loadSurveys()
    res.json(surveys)
  } catch (error) {
    res.status(500).json(error)
  }
})

// get surveys of admin

app.get('/api/surveys/:admin', async (req, res) => {
  const admin = req.params.admin
  try {
    let surveys = await dao.loadAdminSurveys(admin)
    res.json(surveys)
  } catch (error) {
    res.status(500).json(error)
  }
})
// get survey by id

app.get('/api/surveys/:id', async (req, res) => {
  const id = req.params.id
  try {
    let survey = await dao.loadSurvey(id)
    res.json(survey)
  } catch (error) {
    res.status(500).json(error)
  }
})
// get questions of survey

app.get('/api/questions/:id', async (req, res) => {
  const id = req.params.id;
  try {
    let questions = await dao.loadQuestions(id)
    res.json(questions)
  } catch (error) {
    res.status(500).json(error)
  }
})

// get offered answers of question

app.get('/api/offered-answers/:id', async (req, res) => {
  const id = req.params.id;
  try {
    let offeredAnswers = await dao.loadOfferedAnswers(id)
    res.json(offeredAnswers)
  } catch (error) {
    res.status(500).json(error)
  }
})

// get given answers for single survey

app.get('/api/answers/:id', async (req, res) => {
  const id = req.params.id;
  try {
    let answers = await dao.loadAnswers(id)
    res.json(answers)
  } catch (error) {
    res.status(500).json(error)
  }
})

// get users that submit for a given survey

app.get('/api/users/:id', async (req, res) => {
  const id = req.params.id;
  try {
    let users = await dao.loadUsers(id)
    res.json(users)
  } catch (error) {
    res.status(500).json(error)
  }
})
// activate the server
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});