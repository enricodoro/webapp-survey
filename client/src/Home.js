import { Button, ButtonGroup, Row, Col, ListGroup, Badge, Spinner } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import API from './API'
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { QuestionCard } from './QuestionCard'

function Home(props) {
    const [surveys, setSurveys] = useState([])
    const [surveyId, setSurveyId] = useState(-1)
    const [questions, setQuestions] = useState([])
    const [answers, setAnswers] = useState([])
    const [users, setUsers] = useState([])
    const [currentUser, setCurrentUser] = useState("")
    const [userAnswers, setUserAnswers] = useState([])
    const [pos, setPos] = useState(-1)
    const [ready, setReady] = useState(false)

    const clickRight = (e) => {
        let p = pos + 1
        setPos(p)
        setCurrentUser(users[p])
        setUserAnswers(answers.filter((a) => a.id === users[p].uID))
    }

    const clickLeft = (e) => {
        let p = pos - 1
        setPos(p)
        setCurrentUser(users[p])
        setUserAnswers(answers.filter((a) => a.id === users[p].uID))
    }

    useEffect(() => {
        API.loadAdminSurveys(props.admin).then(dbSurveys => {
            setSurveys(dbSurveys)
        })
    }, [props.admin])

    useEffect(() => {
        if (surveyId !== -1) {
            API.loadQuestions(surveyId).then(dbQuestions => {
                setQuestions(dbQuestions)
            })
            API.loadAnswers(surveyId).then(dbAnswers => {
                setAnswers(dbAnswers)
            })
            API.loadUsers(surveyId).then(dbUsers => {
                setUsers(dbUsers)
            })
            setPos(0)
        }
    }, [surveyId])

    useEffect(() => {
        if (answers.length > 0 && users.length > 0 && pos !== -1) {
            setCurrentUser(users[pos])
            setUserAnswers(answers.filter((a) => a.id === users[pos].uID))
        }
    }, [users, answers, pos])


    useEffect(() => {
        if (userAnswers.length > 0)
            setReady(true)
    }, [userAnswers])

    const handleClickSurvey = (id) => {
        if (id !== surveyId) {
            setReady(false)
            setPos(-1)
            setAnswers([])
            setUsers([])
            setUserAnswers([])
            setQuestions([])
            setSurveyId(id)
        }
    }

    return <Row className="d-flex flex-row">
        <Col md={3} id="side">
            <ListGroup>
                {surveys.map((s, i) => <ListGroup.Item className="d-flex flex-row" id="survey-item" action active={surveyId === s.sID ? true : false} onClick={() => handleClickSurvey(s.sID)} key={s.sID}>{s.title} <Badge className="align-self-center ml-auto" id="badge" variant="light">{s.number_of_answers}</Badge></ListGroup.Item>)}
            </ListGroup>
            <Link style={{ textDecoration: 'none' }} to={{
                pathname: "/new-survey"
            }}>
                <Button id="button" className="d-flex mx-auto my-3">Create a new survey</Button>
            </Link>
        </Col>
        <Col className="d-flex flex-column mx-auto" md={6} id="main">
            {ready ? <>
                <ButtonGroup className="mt-4 mb-2">
                    <Button disabled={pos === 0} variant="outline-danger" id="left" onClick={(e) => clickLeft(e)}><FiArrowLeft /></Button>
                    <Button disabled variant="outline-danger">{currentUser.username} ({pos + 1} of {users.length})</Button>
                    <Button disabled={pos === users.length - 1} variant="outline-danger" id="right" onClick={(e) => clickRight(e)}><FiArrowRight /></Button>
                </ButtonGroup>
                <SurveyQuestions questions={questions} answers={userAnswers} surveyId={surveyId} /> </>
                : <></>}
        </Col>
    </Row>
}

function SurveyQuestions(props) {
    console.log(props.answers)
    return <>{props.questions.map((q, i) => <QuestionCard question={q} admin={true} answers={props.answers} key={i} surveyId={props.surveyId} />)}</>
}

export default Home