import { Card, Form, Button, ButtonGroup, Container, Col, Row, Tooltip, OverlayTrigger } from "react-bootstrap"
import { useState, useEffect } from "react";
import { FiArrowDown, FiArrowUp, FiDelete } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import API from './API';

function QuestionCardAdmin(props) {
    const clickButton = (e) => {
        if (e.currentTarget.id === 'down' && props.question.id != props.questions.length - 1) {
            let newQ = [...props.questions]
            let tmp = newQ[props.question.id]
            newQ[props.question.id] = newQ[props.question.id + 1]
            newQ[props.question.id + 1] = tmp
            newQ.forEach((q, i) => q.id = i)
            props.setQuestions(newQ)
        } else if (e.currentTarget.id === 'up' && props.question.id != 0) {
            let newQ = [...props.questions]
            let tmp = newQ[props.question.id]
            newQ[props.question.id] = newQ[props.question.id - 1]
            newQ[props.question.id - 1] = tmp
            newQ.forEach((q, i) => q.id = i)
            props.setQuestions(newQ)
        }
    }

    const handleDelete = (e) => {
        let newQ = [...props.questions]
        newQ = newQ.filter((q) => q.id != props.question.id)
        newQ.forEach((q, i) => q.id = i)
        props.setQuestions(newQ)
        console.log(newQ)
    }

    if (props.question.open)
        return <OpenQuestion question={props.question} clickButton={clickButton} handleDelete={handleDelete} />
    else
        if (props.question.max == 1)
            return <SingleChoiceQuestion question={props.question} clickButton={clickButton} handleDelete={handleDelete} />
        else
            return <MultipleChoiceQuestion question={props.question} clickButton={clickButton} handleDelete={handleDelete} />
}

function SingleChoiceQuestion(props) {

    return <Row>
        <Col md={1} className="d-flex align-self-center justify-content-center">
            <UpDown clickButton={props.clickButton} />
        </Col>
        <Col md={10}>
            <Card id="question-card">
                <Card.Body>
                    <Card.Title>
                        {props.question.title}{props.question.min == 0 ? " *" : ""}
                    </Card.Title>
                    <Form>
                        {props.question.answers.map((a, i) => <Form.Check
                            type="radio"
                            label={a}
                            id={i}
                            name="formRadios"
                            disabled
                        />)}
                    </Form>
                </Card.Body>
            </Card>
        </Col>
        <Col md={1} className="d-flex align-self-center justify-content-center">
            <Delete handleDelete={props.handleDelete} />
        </Col>
    </Row>
}

function MultipleChoiceQuestion(props) {
    return <Row>
        <Col md={1} className="d-flex align-self-center justify-content-center">
            <UpDown clickButton={props.clickButton} />
        </Col>
        <Col md={10}>
            <Card id="question-card">
                <Card.Body>
                    <Card.Title>
                        {props.question.title}{props.question.min == 0 ? " *" : ""}
                    </Card.Title>
                    <Form>
                        {props.question.answers.map((a, i) => <Form.Check
                            type="checkbox"
                            label={a}
                            id={i}
                            disabled
                        />)}
                    </Form>
                </Card.Body>
            </Card>
        </Col>
        <Col md={1} className="d-flex align-self-center justify-content-center">
            <Delete handleDelete={props.handleDelete} />
        </Col>
    </Row>
}

function OpenQuestion(props) {
    return <Row>
        <Col md={1} className="d-flex align-self-center justify-content-center">
            <UpDown clickButton={props.clickButton} />
        </Col>
        <Col md={10}>
            <Card id="question-card">
                <Card.Body>
                    <Card.Title>
                        {props.question.title}{props.question.optional ? " *" : ""}
                    </Card.Title>
                    <Form.Control disabled>

                    </Form.Control>
                </Card.Body>
            </Card>
        </Col>
        <Col md={1} className="d-flex align-self-center justify-content-center">
            <Delete handleDelete={props.handleDelete} />
        </Col>
    </Row>
}

function UpDown(props) {

    return <ButtonGroup vertical>
        <Button variant="outline-danger" id="up" onClick={(e) => props.clickButton(e)}><FiArrowUp /></Button>
        <Button variant="outline-danger" id="down" onClick={(e) => props.clickButton(e)}><FiArrowDown /></Button>
    </ButtonGroup>
}

function Delete(props) {
    return <Button variant="outline-danger" id="delete" onClick={(e) => props.handleDelete(e)}><AiOutlineDelete /></Button>
}

function QuestionCard(props) {
    if (props.question.open === 1)
        return <SubmitOpenQuestion question={props.question} />
    else
        if (props.question.max === 1)
            return <SubmitSingleChoiceQuestion question={props.question} />
        else
            return <SubmitMultipleChoiceQuestion question={props.question} />
}

function SubmitSingleChoiceQuestion(props) {

    const [answers, setAnswers] = useState([])

    useEffect(() => {
        API.loadOfferedAnswers(props.question.id).then(dbOfferedAnswers => {
            setAnswers(dbOfferedAnswers)
        })
    }, [])

    return <Row md={2} className="justify-content-center">
        <Card id="question-card">
            <Card.Body>
                <Card.Title>
                    {props.question.title}{props.question.min == 0 ? " *" : ""}
                </Card.Title>
                <Form>
                    {answers.map((a) => <Form.Check
                        type="radio"
                        label={a.text}
                        id={a.id}
                        key={a.id}
                        name="formRadios"
                    />)}
                </Form>
            </Card.Body>
        </Card>
    </Row>
}

function SubmitMultipleChoiceQuestion(props) {

    const [answers, setAnswers] = useState([])

    useEffect(() => {
        API.loadOfferedAnswers(props.question.id).then(dbOfferedAnswers => {
            setAnswers(dbOfferedAnswers)
        })
    }, [])

    return <Row md={2} className="justify-content-center">
        <Card id="question-card">
            <Card.Body>
                <Card.Title>
                    {props.question.title}{props.question.min == 0 ? " *" : ""}
                </Card.Title>
                <Form>
                    {answers.map((a) => <Form.Check
                        type="checkbox"
                        label={a.text}
                        id={a.id}
                        key={a.id}
                    />)}
                </Form>
            </Card.Body>
        </Card>
    </Row>
}

function SubmitOpenQuestion(props) {
    return <Row md={2} className="justify-content-center">
        <Card id="question-card">
            <Card.Body>
                <Card.Title>
                    {props.question.title}{props.question.optional ? " *" : ""}
                </Card.Title>
                <Form.Control placeholder="Type your answer here"></Form.Control>
            </Card.Body>
        </Card>
    </Row>
}

export { QuestionCardAdmin, QuestionCard };