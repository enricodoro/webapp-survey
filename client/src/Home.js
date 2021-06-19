import { Button, ButtonGroup, Row, Col, ListGroup, Badge } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import API from './API'
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { QuestionCard } from './QuestionCard'

function Home(props) {
    const [surveys, setSurveys] = useState([])
    const [surveyId, setSurveyId] = useState("")
    const [questions, setQuestions] = useState([])
    const [answers, setAnswers] = useState([])
    const [users, setUsers] = useState([])
    const [currentUser, setCurrentUser] = useState("")
    const [userAnswers, setUserAnswers] = useState([])

    const clickButton = (e) => {
        if (e === "right") {
        }
        else if (e === "left") {

        }
    }

    useEffect(() => {
        API.loadAdminSurveys(props.admin).then(dbSurveys => {
            setSurveys(dbSurveys)
        })
    }, [props.admin])

    useEffect(() => {
        API.loadQuestions(surveyId).then(dbQuestions => {
            setQuestions(dbQuestions)
        })
        API.loadAnswers(surveyId).then(dbAnswers => {
            setAnswers(dbAnswers)
        })
        API.loadUsers(surveyId).then(dbUsers => {
            setUsers(dbUsers)
        })
    }, [surveyId])

    return <Row className="d-flex flex-row">
        <Col md={3} id="side">
            <ListGroup>
                {surveys.map((s, i) => <ListGroup.Item className="d-flex flex-row" id="survey-item" action active={surveyId === s.surveyId ? true : false} onClick={() => setSurveyId(s.surveyId)} key={s.surveyId}>{s.title} <Badge className="align-self-center ml-auto" id="badge" variant="light">{s.number_of_answers}</Badge></ListGroup.Item>)}
            </ListGroup>
            <Link style={{ textDecoration: 'none' }} to={{
                pathname: "/new-survey"
            }}>
                <Button id="button" className="d-flex mx-auto my-3">Create a new survey</Button>
            </Link>
        </Col>
        <Col className="d-flex flex-column mx-auto" md={6} id="main">
            <ButtonGroup className="mx-auto mt-2">
                <Button variant="outline-danger" id="left" onClick={(e) => clickButton(e.target.id)}><FiArrowLeft /></Button>
                <Button disabled variant="outline-danger">{currentUser}</Button>
                <Button variant="outline-danger" id="right" onClick={(e) => clickButton(e.target.id)}><FiArrowRight /></Button>
            </ButtonGroup>
            <SurveyQuestions questions={questions} answers={userAnswers} />
        </Col>
    </Row>
}

function SurveyQuestions(props) {
    return <>{props.questions.map((q) => <QuestionCard question={q} admin={true} answers={props.answers} key={q.id} />)}</>
}


export default Home