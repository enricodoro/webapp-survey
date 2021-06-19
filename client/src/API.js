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

async function loadOfferedAnswers(id) {
    const response = await fetch(url + "/api/offered-answers/" + id)
    const offeredAnswers = await response.json()
    return offeredAnswers
}

const API = { loadSurveys, loadQuestions, loadOfferedAnswers }
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
export default API