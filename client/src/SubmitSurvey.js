import { useState, useEffect } from 'react';
import { ListGroup, Col, Button, Form, Card } from 'react-bootstrap';
import { QuestionCard } from './QuestionCard.js'
import API from './API';

function SubmitSurvey(props) {
    const [questions, setQuestions] = useState([])
    const [givenAnswers, setGivenAnswers] = useState([])
    const [survey, setSurvey] = useState({})
    const [username, setUsername] = useState("")

    // const answer = {
    //     idUser: ,
    //     idQuestion: ,
    //     idAnswer: ,
    //     text: ,
    // };

    const handleName = (e) => {
        setUsername(e)
    }

    useEffect(() => {
        API.loadQuestions(props.surveyId).then(dbQuestions => {
            setQuestions(dbQuestions)
        })
    }, [])

    useEffect(() => {
        API.loadSurvey(props.surveyId).then(dbSurvey => {
            setSurvey(dbSurvey)
        })
    }, [])

    return <Col className="d-flex flex-column mx-auto mt-3" style={{width: "60%"}}>
        <h1 className="text-center">{props.title}</h1>
        <h6 className="mandatory" >Mandatory questions are marked with</h6>
        <Card className="mx-auto" id="username-card">
            <Card.Body>
            <Card.Title className="mandatory">Insert your name</Card.Title>
                <Form>
                    <Form.Control maxLength="30" onChange={(e) => handleName(e.target.value)} placeholder="Insert your name or a username" />
                </Form>
            </Card.Body>
        </Card>
        <ListGroup setGivenAnswers={setGivenAnswers}>
            {questions.map((q, i) => <QuestionCard question={q} key={q.id} />)}
        </ListGroup>
        <Button id="button" className="mx-auto my-3" size="lg">Submit</Button>
    </Col>
}

export default SubmitSurvey;