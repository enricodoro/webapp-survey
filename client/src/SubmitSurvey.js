import { useState, useEffect } from 'react';
import { ListGroup, Col, Button, Form, Card } from 'react-bootstrap';
import { QuestionCard } from './QuestionCard.js'
import { Link } from 'react-router-dom'
import API from './API';

function SubmitSurvey(props) {
    const [questions, setQuestions] = useState([])
    const [givenAnswers, setGivenAnswers] = useState([])
    const [username, setUsername] = useState("")
    const [required, setRequired] = useState(0)
    const [count, setCount] = useState(0)
    const [enable, setEnable] = useState(true)

    // givenAnswer = {qID: n, aID: n, text: string}

    const handleName = (e) => {
        setUsername(e)
    }

    const handleSubmit = () => {
        let user = {
            username: username,
            sID: props.surveyId
        }
        API.addUser(user).then(id => {
            givenAnswers.forEach((a) => {
                let answer = {
                    id: id,
                    sID: props.surveyId,
                    qID: a.qID,
                    aID: a.aID,
                    text: a.text
                }
                API.addUserAnswer(answer).then((status) => {
                    console.log(status)
                })
            })
        })
    }

    useEffect(() => {
        if (count !== 0) {
            console.log(required + "/" + count)
            if (username.length > 0 && required === count)
                setEnable(false)
            else
                setEnable(true)
        }
    }, [username, required, count])

    useEffect(() => {
        API.loadQuestions(props.surveyId).then(dbQuestions => {
            setQuestions(dbQuestions)
            setCount(dbQuestions.filter((q) => q.min >= 1).length)
        })
    }, [props.surveyId])

    return <Col className="d-flex flex-column mx-auto mt-3" style={{ width: "60%" }}>
        <h1 className="text-center">{props.title}</h1>
        <h6 className="mandatory" >Mandatory questions are marked with</h6>
        <Card className="mx-auto" id="username-card">
            <Card.Body>
                <Card.Title className="mandatory">Insert your name</Card.Title>
                <Form>
                    <Form.Control maxLength="30" onChange={(e) => handleName(e.target.value)} placeholder="Insert your name or a username" />
                    <Form.Text>{username.length}/30</Form.Text>
                </Form>
            </Card.Body>
        </Card>
        <ListGroup>
            {questions.map((q, i) => <QuestionCard setRequired={setRequired} question={q} surveyId={props.surveyId} key={i} givenAnswers={givenAnswers} setGivenAnswers={setGivenAnswers} />)}
        </ListGroup>
        <Link className="mx-auto my-3" style={{ textDecoration: 'none' }} to={{
            pathname: "/"
        }}>
            <Button disabled={enable} id="button" size="lg" onClick={() => handleSubmit()}>Submit</Button>
        </Link>
    </Col>
}

export default SubmitSurvey;