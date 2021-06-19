import { Modal, Button, Form, Col, InputGroup } from 'react-bootstrap'
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
            let q = { id: props.questions.length, title: title, open: true, optional: optional }
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
    const [min, setMin] = useState(1)
    const [max, setMax] = useState(1);
    const [validated, setValidated] = useState(false);

    const handleTitle = (val) => {
        setTitle(val)
    }

    const handleOptional = (val) => {
        val ? setMin(0) : setMin(1)
    }

    const handleMax = (val) => {
        setMax(val)
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
        setAnswers(newA.filter((a,i) => i !== ansId))
    }

    const handleClose = () => {
        setTitle("")
        setMin(1)
        setMax(1)
        setAnswers([""])
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
        console.log(answers)
        for (let i = 0; i < answers.length; i++) {
            if (answers[i].length === 0) {
                valid = false
                break
            }
        }

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
        <Form noValidate validated={validated}>
            <Modal.Header closeButton onClick={() => props.setShow([false, false])}>
                <Modal.Title id="contained-modal-title-vcenter">
                    New close-ended question
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group>
                    <Form.Control required size="lg" maxLength="64" type="text" placeholder="Type a question" onChange={(e) => handleTitle(e.target.value)} />
                </Form.Group>
                <Form.Group id="answers-list">
                    {answers.map((a, i) => <NewAnswer handleDelete={handleDelete} handle={handleChange} ansText={a} ansId={i} />)}
                </Form.Group>
                <Form.Row>
                    <Form.Group as={Col}>
                        <Form.Control id="max" as="select" onChange={(e) => handleMax(e.target.value)}>
                            {answers.map((a, i) => <option>{i + 1}</option>)}
                        </Form.Control>
                        <Form.Text className="text-muted">Maximum number of answers</Form.Text>
                    </Form.Group>
                    <Col md={9}></Col>
                </Form.Row>
            </Modal.Body>
            <Modal.Footer>
                <Form.Group>
                    <Form.Check
                        type="switch"
                        id="min"
                        label="Optional"
                        onChange={(e) => handleOptional(e.target.checked)}
                    />
                </Form.Group>
                <Button id="button" onClick={() => addNewAnswer()}>Add new answer</Button>
                <Button id="button" onClick={() => handleClose()}>Close</Button>
                <Button variant="success" onClick={handleSave}>Save</Button>
            </Modal.Footer>
        </Form>
    </Modal>
}

function NewAnswer(props) {
    return <InputGroup className="mb-3">
        <Form.Control required onChange={(e) => props.handle(e, props.ansId)} placeholder="Type a possible answer" value={props.ansText} />
        <Button variant="outline-danger" onClick={(e) => props.handleDelete(e, props.ansId)}>
            <AiOutlineDelete />
        </Button>
    </InputGroup>
}

export { OpenedQuestionModal, ClosedQuestionModal }