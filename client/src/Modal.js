import { Modal, Button, Form, Col, Row, InputGroup, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { useState } from 'react'
import { AiOutlineDelete } from "react-icons/ai";

function OpenedQuestionModal(props) {
    const [title, setTitle] = useState("")
    const [optional, setOptional] = useState(false)
    const [validated, setValidated] = useState(false);

    const handleTitle = (val) => {
        setTitle(val)
    }

    const handleOptional = (val) => {
        setOptional(val)
    }

    const handleClose = () => {
        setTitle("")
        setOptional(false)
        setValidated(false)
        props.setShow([false, false])
    }

    const handleSave = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }

        setValidated(true);

        let valid = true

        if (title.length === 0) valid = false

        if (valid) {
            console.log(props.questions.length)
            let q = { id: props.questions.length, title: title, open: true, min: optional ? 0 : 1, max: 0, answers: [] }
            props.setQuestions(old => [...old, q])
            handleClose()
        }
    }

    return <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={props.show[0]}
        onHide={handleClose}
    >
        <Form noValidate validated={validated}>
            <Modal.Header closeButton onClick={() => props.setShow([false, false])}>
                <Modal.Title id="contained-modal-title-vcenter">
                    New open-ended question
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group controlId="validateTitle">
                    <Form.Control required size="lg" maxLength="64" type="text" placeholder="Type a question" onChange={(e) => handleTitle(e.target.value)} />
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Form.Group>
                    <Form.Check
                        type="switch"
                        id="optional"
                        label="Optional"
                        onChange={(e) => handleOptional(e.target.checked)}
                    />
                </Form.Group>
                <Button id="button" onClick={() => handleClose()}>Close</Button>
                <Button variant="success" onClick={handleSave}>Save</Button>
            </Modal.Footer>
        </Form>
    </Modal>
}

function ClosedQuestionModal(props) {
    const [answers, setAnswers] = useState([""])
    const [title, setTitle] = useState("")
    const [min, setMin] = useState(0)
    const [max, setMax] = useState(1)
    const [validated, setValidated] = useState(false);

    const handleTitle = (val) => {
        setTitle(val)
    }

    const handleMax = (val) => {
        setMax(val)
    }

    const handleMin = (val) => {
        setMin(val)
    }

    const addNewAnswer = () => {
        let text = ""
        setAnswers(old => [...old, text])
    }

    const handleChange = (e, ansId) => {
        let text = e.currentTarget.value
        let newArr = [...answers]
        newArr[ansId] = text
        setAnswers(newArr)
    }

    const handleDelete = (e, ansId) => {
        let newA = [...answers]
        setAnswers(newA.filter((a, i) => i !== ansId))
    }

    const handleClose = () => {
        setTitle("")
        setMin(0)
        setMax(1)
        setAnswers([""])
        setValidated(false)
        props.setShow([false, false])
    }

    const handleSave = (event) => {
        const form = event.currentTarget
        if (form.checkValidity() === false) {
            event.preventDefault()
            event.stopPropagation()
        }

        setValidated(true)

        let valid = true
        if (title.length === 0) valid = false
        for (let i = 0; i < answers.length; i++) {
            if (answers[i].length === 0) {
                valid = false
                break
            }
        }
        if (max < min) valid = false

        if (valid) {
            let q = { id: props.questions.length, title: title, open: false, min: min, max: max, answers: answers }
            props.setQuestions(old => [...old, q])
            handleClose()
        }
    }

    return <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={props.show[1]}
        onHide={handleClose}
    >
        <Modal.Header closeButton onClick={() => props.setShow([false, false])}>
            <Modal.Title id="contained-modal-title-vcenter">
                New close-ended question
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form noValidate validated={validated}>
                <Form.Group>
                    <Form.Control required size="lg" maxLength="64" type="text" placeholder="Type a question" onChange={(e) => handleTitle(e.target.value)} />
                </Form.Group>
                <Form.Group id="answers-list">
                    {answers.map((a, i) => <NewAnswer handleDelete={handleDelete} handle={handleChange} ansText={a} ansId={i} />)}
                </Form.Group>
            </Form>
            <Form.Row>
                <Form.Group as={Col} md={4} className="mt-3">
                    <Form.Control isInvalid={min > max} id="min" as="select" onChange={(e) => handleMin(e.target.value)}>
                        <option>0</option>
                        {answers.map((a, i) => <option>{i + 1}</option>)}
                    </Form.Control>
                    <Form.Text className="text-muted">Minimum number of answers</Form.Text>
                </Form.Group>
            </Form.Row>
            <Form.Row>
                <Form.Group as={Col} md={4}>
                    <Form.Control isInvalid={min > max} id="max" as="select" onChange={(e) => handleMax(e.target.value)}>
                        {answers.map((a, i) => <option>{i + 1}</option>)}
                    </Form.Control>
                    <Form.Control.Feedback placement="right" type="invalid" tooltip>The maximum number of answers must be greater than or equal to the minimum.</Form.Control.Feedback>
                    <Form.Text className="text-muted">Maximum number of answers</Form.Text>
                </Form.Group>
            </Form.Row>
        </Modal.Body>
        <Modal.Footer>
            <Button id="button" onClick={() => addNewAnswer()}>Add new answer</Button>
            <Button id="button" onClick={() => handleClose()}>Close</Button>
            <Button variant="success" onClick={handleSave}>Save</Button>
        </Modal.Footer>
    </Modal >
}

function NewAnswer(props) {
    return <InputGroup className="mb-3">
        <Form.Control className="mr-3" required onChange={(e) => props.handle(e, props.ansId)} placeholder="Type a possible answer" value={props.ansText} />
        <Button variant="outline-danger" onClick={(e) => props.handleDelete(e, props.ansId)}>
            <AiOutlineDelete />
        </Button>
    </InputGroup>
}

export { OpenedQuestionModal, ClosedQuestionModal }