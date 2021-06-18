import { useState, useEffect } from 'react';
import { ListGroup } from 'react-bootstrap';
import { QuestionCard } from './QuestionCard.js'
import API from './API';

function SubmitSurvey(props) {
    const [questions, setQuestions] = useState([])

    useEffect(() => {
        API.loadQuestions(props.surveyId).then(dbQuestions => {
            setQuestions(dbQuestions)
        })
    }, [])
    console.log(questions)

    return <ListGroup>
        {questions.map((q) => <QuestionCard question={q} key={q.id} />)}
    </ListGroup>
}

export default SubmitSurvey;