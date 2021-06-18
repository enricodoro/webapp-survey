const url = 'http://localhost:3000'

async function loadSurveys() {
    const response = await fetch(url + "/api/surveys")
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
export default API