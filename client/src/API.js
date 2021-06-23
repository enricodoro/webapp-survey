const url = 'http://localhost:3000'

async function loadSurveys() {
    const response = await fetch(url + "/api/surveys")
    const surveys = await response.json()
    return surveys
}

async function loadAdminSurveys(admin) {
    const response = await fetch(url + "/api/surveys/" + admin)
    const surveys = await response.json()
    return surveys
}

async function loadQuestions(id) {
    const response = await fetch(url + "/api/questions/" + id)
    const questions = await response.json()
    return questions
}

async function loadOfferedAnswers(sID, qID) {
    const response = await fetch(url + "/api/offered-answers/" + sID + "/" + qID)
    const offeredAnswers = await response.json()
    return offeredAnswers
}

async function loadAnswers(id) {
    const response = await fetch(url + "/api/answers/" + id)
    const answers = await response.json()
    return answers
}

async function loadUsers(id) {
    const response = await fetch(url + "/api/users/" + id)
    const users = await response.json()
    return users
}

async function loadSurvey(id) {
    const response = await fetch(url + "/api/surveys/" + id)
    const survey = await response.json()
    return survey
}

async function logIn(credentials) {
    let response = await fetch(url + '/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
    }
    )
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

async function logOut() {
    await fetch(url + '/api/sessions/current', { method: 'DELETE' })
}

async function getAdmin() {
    let response = await fetch(url + '/api/getCurrentUser')
    if (response.ok) {
        const userId = await response.json()
        return userId
    }
}

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

async function addUserAnswer(answer) {
    let response = await fetch(url + '/api/addUserAnswer/',
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(answer)
        }
    )
    if (response.ok) {
        await response.json()
    }
}

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

async function addAnswer(answer) {
    let response = await fetch(url + '/api/addAnswer/',
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(answer)
        }
    )
    if (response.ok) {
    }
}

const API = { addUser, addUserAnswer, addQuestion, addAnswer, addSurvey, loadSurveys, loadAdminSurveys, loadQuestions, loadAnswers, loadUsers, loadOfferedAnswers, loadSurvey, logIn, logOut, getAdmin }
export default API