const url = 'http://localhost:3000'

// [FUNCTIONS TO GET DATA FROM DATABASE]

// load all surveys
async function loadSurveys() {
    const response = await fetch(url + "/api/surveys")
    const surveys = await response.json()
    return surveys
}

// load surveys only of the given admin
async function loadAdminSurveys(admin) {
    const response = await fetch(url + "/api/surveys/" + admin)
    const surveys = await response.json()
    return surveys
}

// load all questions of a given survey
async function loadQuestions(id) {
    const response = await fetch(url + "/api/questions/" + id)
    const questions = await response.json()
    return questions
}

// load all possible answers of a given question (of a given survey)
async function loadOfferedAnswers(sID, qID) {
    const response = await fetch(url + "/api/offered-answers/" + sID + "/" + qID)
    const offeredAnswers = await response.json()
    return offeredAnswers
}

// load answers given by a user realated to a specific question
async function loadAnswers(id) {
    const response = await fetch(url + "/api/answers/" + id)
    const answers = await response.json()
    return answers
}

// load all users that answered to a given survey
async function loadUsers(id) {
    const response = await fetch(url + "/api/users/" + id)
    const users = await response.json()
    return users
}

// laod a specific survey
async function loadSurvey(id) {
    const response = await fetch(url + "/api/surveys/" + id)
    const survey = await response.json()
    return survey
}

// [FUNCTIONS TO MANAGE ADMIN LOGIN/LOGOUT]

// manage login
async function logIn(credentials) {
    let response = await fetch(url + '/api/sessions', 
    {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
    })
    if (response.ok) {
        const user = await response.json()
        return user.id
    }
    else {
        try {
            const errDetail = await response.json()
            throw errDetail.message
        }
        catch (err) {
            throw err
        }
    }
}

// manage logout
async function logOut() {
    await fetch(url + '/api/sessions/current', { method: 'DELETE' })
}


// get the id of the current logged in admin
async function getAdmin() {
    let response = await fetch(url + '/api/getCurrentUser')
    if (response.ok) {
        const userId = await response.json()
        return userId
    }
}

// [FUNCTIONS TO ANSWER TO A SURVEY]

// add a user that answered to a survey
async function addUser(user) {
    let response = await fetch(url + '/api/addUser/',
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        }
    )
    if (response.ok) {
        const uID = await response.json()
        return uID
    }
}

// add a single answer that the user has given to a certain question
async function addUserAnswer(answer) {
    let response = await fetch(url + '/api/addUserAnswer/',
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(answer)
        }
    )
    if (response.ok) {
        let status = await response.json()
        return status
    }
}

// [FUNCTIONS TO CREATE A NEW SURVEY]

// add a new survey created by the current admin
async function addSurvey(survey) {
    const response = await fetch(url + '/api/addSurvey/',
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(survey)
        }
    )
    if (response.ok) {
        let surveyId = await response.json()
        return surveyId
    }
}

// add a single question related to a specific survey
async function addQuestion(question) {
    let response = await fetch(url + '/api/addQuestion/',
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(question)
        }
    )
    if (response.ok) {
        let questionID = await response.json()
        return questionID
    }
}

// add a single answer related to a specific question
async function addAnswer(answer) {
    let response = await fetch(url + '/api/addAnswer/',
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(answer)
        }
    )
    if (response.ok) {
        let status = await response.json()
        return status
    }
}

const API = { addUser, addUserAnswer, addQuestion, addAnswer, addSurvey, loadSurveys, loadAdminSurveys, loadQuestions, loadAnswers, loadUsers, loadOfferedAnswers, loadSurvey, logIn, logOut, getAdmin }
export default API