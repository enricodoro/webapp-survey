import { ListGroup, Form, Col, Row, ButtonGroup, Button } from "react-bootstrap"
import { useState, useEffect } from 'react'
import { QuestionCardAdmin } from './QuestionCard.js'
import { OpenedQuestionModal, ClosedQuestionModal } from "./Modal.js"
import { Link } from 'react-router-dom'
import API from "./API.js"

function NewSurvey(props) {
    const [show, setShow] = useState([false, false])
    const [enable, setEnable] = useState(true)
    const [questions, setQuestions] = useState([])
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")

    const handleTitle = (val) => {
        setTitle(val)
    }

    const handleDescription = (val) => {
        setDescription(val)
    }

    useEffect(() => {
        if (title.length > 0 && questions.length > 0)
            setEnable(false)
        else setEnable(true)
    }, [questions, title])

    const handleSave = () => {
        let survey = {
            adminID: props.adminID,
            title: title,
            description: description
        }
        API.addSurvey(survey).then(sID => {
            questions.forEach((q, qID) => {
                let question = {
                    sID: sID,
                    qID: qID,
                    title: q.title,
                    open: q.open,
                    min: q.min,
                    max: q.max,
                    answers: q.answers
                }
                API.addQuestion(question).then((questionID) => {
                    q.answers.forEach((a, aID) => {
                        let answer = {
                            sID: sID,
                            qID: questionID,
                            aID: aID,
                            text: a
                        }
                        API.addAnswer(answer).then(() => {
                            console.log("END SAVING IN DB")
                        })
                    })
                })
            })
        })
    }

    return <Row className="d-flex flex-column mx-auto" style={{ width: "60%" }}>
        <TitleAdmin handleTitle={handleTitle} handleDescription={handleDescription} />
        <ListGroup>
            {questions.map((q) => <QuestionCardAdmin questions={questions} setQuestions={setQuestions} question={q} />)}
        </ListGroup>
        <OpenedQuestionModal questions={questions} setQuestions={setQuestions} show={show} setShow={setShow} />
        <ClosedQuestionModal questions={questions} setQuestions={setQuestions} show={show} setShow={setShow} />
        <Controls setShow={setShow} handleSave={handleSave} enable={enable} title={title} />
    </Row>
}

function TitleAdmin(props) {
    return <Col md={12} className="mt-3">
        <Form>
            <Form.Group id="title">
                <Form.Control required size="lg" maxLength="32" type="text" placeholder="Your survey title" onChange={(e) => props.handleTitle(e.target.value)} />
            </Form.Group>
            <Form.Group id="description">
                <Form.Control required maxLength="64" type="text" placeholder="Your survey description" onChange={(e) => props.handleDescription(e.target.value)} />
            </Form.Group>
            <h6 className="mandatory">Mandatory questions will be marked with</h6>
        </Form>
    </Col>
}

function Controls(props) {
    const handleShow = (n) => {
        let arr = [false, false]
        arr[n] = true
        props.setShow(arr)
    }

    return <Col className="d-flex flex-column mx-auto">
        <ButtonGroup size="lg" className="mt-3 mb-3" style={{ width: "100%" }}>
            <Button id="btn-outlined" onClick={() => handleShow(0)}>New open-ended question</Button>
            <Button id="btn-outlined" onClick={() => handleShow(1)}>New close-ended question</Button>
        </ButtonGroup>
        <Link className="mx-auto mb-3" style={{ textDecoration: 'none' }} to={{
            pathname: "/home"
        }}>
            <Button size="lg" disabled={props.enable} variant="outline-success" onClick={() => props.handleSave()}>Save</Button>
        </Link>
    </Col>
}

export default NewSurvey;