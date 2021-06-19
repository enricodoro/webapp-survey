import { ListGroup, Form, Col, Row, ButtonGroup, Button, Tooltip, OverlayTrigger } from "react-bootstrap"
import { useState } from 'react'
import { QuestionCardAdmin } from './QuestionCard.js'
import { OpenedQuestionModal, ClosedQuestionModal } from "./Modal.js"

// question example: [id, title, open, min, max, optional, answers[]]


function NewSurvey(props) {
    const [show, setShow] = useState([false, false])
    const [showOverlay, setShowOverlay] = useState(false)
    const [questions, setQuestions] = useState([])
    const [title, setTitle] = useState("")
    const [descripton, setDescription] = useState("")

    const handleTitle = (val) => {
        showOverlay ? setShowOverlay(false) : 
        setTitle(val)
    }

    const handleDescription = (val) => {
        setDescription(val)
    }

    const handleSave = () => {
        let valid = true
        if (title.length === 0) valid = false
        if (valid) {
            //save
        } else {
            setShowOverlay(true)
        }
    }

    return <Row className="d-flex flex-column mx-auto" style={{width:"60%"}}>
        <TitleAdmin handleTitle={handleTitle} handleDescription={handleDescription} />
        <ListGroup>
            {questions.map((q) => <QuestionCardAdmin questions={questions} setQuestions={setQuestions} question={q} />)}
        </ListGroup>
        <OpenedQuestionModal questions={questions} setQuestions={setQuestions} show={show} setShow={setShow} />
        <ClosedQuestionModal questions={questions} setQuestions={setQuestions} show={show} setShow={setShow} />
        <Controls setShow={setShow} handleSave={handleSave} showOverlay={showOverlay}/>
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

    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
          A title is required
        </Tooltip>
      );

    return <ButtonGroup size="lg" className="mt-3 mb-3" style={{ width: "100%" }}>
        <Button id="btn-outlined" onClick={() => handleShow(0)}>New open-ended question</Button>
        <Button id="btn-outlined" onClick={() => handleShow(1)}>New close-ended question</Button>
        <OverlayTrigger
            show={props.showOverlay}
            placement="right"
            overlay={renderTooltip}
        >
            <Button variant="outline-success" onClick={() => props.handleSave()}>Save</Button>
        </OverlayTrigger>
    </ButtonGroup>
}

export default NewSurvey;