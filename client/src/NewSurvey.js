import { ListGroup, Form, Col, ButtonGroup, Button } from "react-bootstrap"
import { useEffect, useState } from 'react'
import { QuestionCardAdmin } from './QuestionCard.js'
import { OpenedQuestionModal, ClosedQuestionModal } from "./Modal.js"

// question example: [id, title, open, min, max, optional, answers[]]


function NewSurvey(props) {
    const [show, setShow] = useState([false, false])
    const [questions, setQuestions] = useState([])
    
    const handleSave = () => {
        //db
    }

    return <>
        <TitleAdmin />
        <ListGroup>
            {questions.map((q) => <QuestionCardAdmin questions={questions} setQuestions={setQuestions} question={q} />)}
        </ListGroup>
        <OpenedQuestionModal questions={questions} setQuestions={setQuestions} show={show} setShow={setShow} setQuestions={setQuestions} />
        <ClosedQuestionModal questions={questions} setQuestions={setQuestions} show={show} setShow={setShow} />
        <Controls setShow={setShow} handleSave={handleSave} />
    </>
}

function TitleAdmin(props) {
    return <Col md={12} className="mt-3">
        <Form>
            <Form.Group id="title">
                <Form.Control size="lg" maxLength="32" type="text" placeholder="Your survey title" />
                <Form.Text className="text-muted" >
                </Form.Text>
            </Form.Group>
            <Form.Group id="description">
                <Form.Control maxLength="64" type="text" placeholder="Your survey description" />
                <Form.Text className="text-muted">
                </Form.Text>
            </Form.Group>
        </Form>
    </Col>
}

function Controls(props) {
    const handleShow = (n) => {
        let arr = [false, false]
        arr[n] = true
        props.setShow(arr)
    }

    return <ButtonGroup size="lg" className="mt-3 mb-3" style={{ width: "100%" }}>
        <Button id="btn-outlined" onClick={() => handleShow(0)}>New opened question</Button>
        <Button id="btn-outlined" onClick={() => handleShow(1)}>New closed question</Button>
        <Button variant="outline-success" onClick={() => props.handleSave()}>Save</Button>
    </ButtonGroup>
}

export default NewSurvey;