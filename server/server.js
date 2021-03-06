'use strict'

const express = require('express')
const morgan = require('morgan')
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

// login management

passport.use(new passportLocal.Strategy((username, password, done) => {
  dao.getAdmin(username, password).then(user => {
    if (user)
      done(null, user)
    else
      done(null, false, { message: "username or password are incorrect" })
  }).catch(err => {
    done(err)
  })
}))

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  dao.getAdminById(id)
    .then(user => {
      done(null, user) // this will be available in req.user
    }).catch(err => {
      done(err, null)
    })
})

// custom middleware: check if a given request is coming from an authenticated user
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated())
    return next()

  return res.status(401).json({ error: 'not authenticated' })
}

// login
app.post('/api/sessions', function (req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err)
    if (!user) {
      // display wrong login messages
      return res.status(401).json(info)
    }
    // success, perform the login
    req.login(user, (err) => {
      if (err)
        return next(err)

      // req.user contains the authenticated user, we send all the user info back
      // this is coming from dao.getAdmin()
      return res.status(200).json(req.user)
    })
  })(req, res, next)
})

app.delete('/api/sessions/current', (req, res) => {
  req.logout()
  res.end()
})

app.get('/api/getCurrentUser', function (req, res) {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user)
  }
  else
    res.status(401).json({ error: 'Unauthenticated user!' })
})

app.post('/api/addUser/', async (req, res) => {
  const user = req.body
  try {
    let result = await dao.addUser(user)
    res.status(201).json(result)
  }
  catch (error) {
    res.status(503).json(error)
  }
})

app.post('/api/addUserAnswer/', async (req, res) => {
  const answer = req.body
  try {
    let result = await dao.addUserAnswer(answer)
    res.status(201).json(result)
  }
  catch (error) {
    res.status(503).json(error)
  }
})

app.post('/api/addSurvey/', isLoggedIn, async (req, res) => {
  const survey = req.body
  try {
    let result = await dao.addSurvey(survey)
    res.status(201).json(result)
  } catch (error) {
    res.status(503).json(error)
  }
})

app.post('/api/addQuestion/', isLoggedIn, async (req, res) => {
  const question = req.body
  try {
    let result = await dao.addQuestion(question)
    res.status(201).json(result)
  } catch (error) {
    res.status(503).json(error)
  }
})

app.post('/api/addAnswer/', isLoggedIn, async (req, res) => {
  const answer = req.body
  try {
    let result = await dao.addAnswer(answer)
    res.status(201).json(result)
  } catch (error) {
    res.status(503).json(error)
  }
})

// get all surveys

app.get('/api/surveys', async (req, res) => {
  try {
    let surveys = await dao.loadSurveys()
    res.status(200).json(surveys)
  } catch (error) {
    res.status(500).json(error)
  }
})

// get surveys of admin

app.get('/api/surveys/:admin', isLoggedIn, async (req, res) => {
  const admin = req.params.admin
  try {
    let surveys = await dao.loadAdminSurveys(admin)
    res.status(200).json(surveys)
  } catch (error) {
    res.status(500).json(error)
  }
})

// get survey by id

app.get('/api/surveys/:id', async (req, res) => {
  const id = req.params.id
  try {
    let survey = await dao.loadSurvey(id)
    res.status(200).json(survey)
  } catch (error) {
    res.status(500).json(error)
  }
})

// get questions of survey

app.get('/api/questions/:id', async (req, res) => {
  const id = req.params.id
  try {
    let questions = await dao.loadQuestions(id)
    res.status(200).json(questions)
  } catch (error) {
    res.status(500).json(error)
  }
})

// get offered answers of question

app.get('/api/offered-answers/:sID/:qID', async (req, res) => {
  const sID = req.params.sID
  const qID = req.params.qID
  try {
    let offeredAnswers = await dao.loadOfferedAnswers(sID, qID)
    res.status(200).json(offeredAnswers)
  } catch (error) {
    res.status(500).json(error)
  }
})

// get given answers for single survey

app.get('/api/answers/:id', async (req, res) => {
  const id = req.params.id
  try {
    let answers = await dao.loadAnswers(id)
    res.status(200).json(answers)
  } catch (error) {
    res.status(500).json(error)
  }
})

// get users that answered a given survey

app.get('/api/users/:id', async (req, res) => {
  const id = req.params.id
  try {
    let users = await dao.loadUsers(id)
    res.status(200).json(users)
  } catch (error) {
    res.status(500).json(error)
  }
})

// activate the server
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})