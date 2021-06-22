import { Card, Form, Button, ButtonGroup, Col, Row } from "react-bootstrap"
import { useState, useEffect } from "react";
import { FiArrowDown, FiArrowUp } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import API from './API';

function QuestionCardAdmin(props) {
    const clickButton = (e) => {
        if (e.currentTarget.id === 'down' && props.question.id !== props.questions.length - 1) {
            let newQ = [...props.questions]
            let tmp = newQ[props.question.id]
            newQ[props.question.id] = newQ[props.question.id + 1]
            newQ[props.question.id + 1] = tmp
            newQ.forEach((q, i) => q.id = i)
            props.setQuestions(newQ)
        } else if (e.currentTarget.id === 'up' && props.question.id !== 0) {
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
        newQ = newQ.filter((q) => q.id !== props.question.id)
        newQ.forEach((q, i) => q.id = i)
        props.setQuestions(newQ)
        console.log(newQ)
    }

    if (props.question.open)
        return <OpenQuestion question={props.question} clickButton={clickButton} handleDelete={handleDelete} />
    else
        if (props.question.max === 1)
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
                    <Card.Title className={props.question.min === 0 ? "" : "mandatory"}>
                        {props.question.title}
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
                    <Card.Title className={props.question.min === 0 ? "" : "mandatory"}>
                        {props.question.title}
                    </Card.Title>
                    <Form>
                        {props.question.answers.map((a, i) => <Form.Check
                            type="checkbox"
                            label={a}
                            id={i}
                            disabled
                        />)}
                    </Form>
                    <Form.Text>A maximum of {props.question.max} answers can be chosen</Form.Text>
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
                    <Card.Title className={props.question.min === 0 ? "" : "mandatory"}>
                        {props.question.title}
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
        return props.admin ? <ShowOpenAnswers question={props.question} answers={props.answers} /> : <SubmitOpenQuestion question={props.question} givenAnswers={props.givenAnswers} setGivenAnsers={props.setGivenAnsers}/>
    else
        if (props.question.max === 1)
            return props.admin ? <ShowSingleChoiceAnswers question={props.question} surveyId={props.surveyId} answers={props.answers} /> : <SubmitSingleChoiceQuestion question={props.question} givenAnswers={props.givenAnswers} setGivenAnsers={props.setGivenAnsers} surveyId={props.surveyId} />
        else
            return props.admin ? <ShowMultipleChoiceAnswers question={props.question} surveyId={props.surveyId} answers={props.answers} /> : <SubmitMultipleChoiceQuestion question={props.question} givenAnswers={props.givenAnswers} setGivenAnsers={props.setGivenAnsers} surveyId={props.surveyId} />
}

function SubmitSingleChoiceQuestion(props) {

    const [answers, setAnswers] = useState([])

    useEffect(() => {
        API.loadOfferedAnswers(props.surveyId, props.question.qID).then(dbOfferedAnswers => {
            setAnswers(dbOfferedAnswers)
        })
    }, [])

    return <Card className="mx-auto" id="question-card">
        <Card.Body>
            <Card.Title className={props.question.min === 0 ? "" : "mandatory"}>
                {props.question.title}
            </Card.Title>
            <Form>
                {answers.map((a) => <Form.Check
                    type="radio"
                    label={a.text}
                    id={a.aID}
                    key={a.aID}
                    name="formRadios"
                />)}
            </Form>
        </Card.Body>
    </Card>
}

function SubmitMultipleChoiceQuestion(props) {

    const [answers, setAnswers] = useState([])
    const [max, setMax] = useState(0)

    const checkMax = (e) => {
        if (e.checked && max < props.question.max) setMax(old => old + 1)
        else if (!e.checked && max > 0) setMax(old => old - 1)
        if (max === props.question.max)
            console.log(max)
    }

    useEffect(() => {
        API.loadOfferedAnswers(props.surveyId, props.question.qID).then(dbOfferedAnswers => {
            setAnswers(dbOfferedAnswers)
        })
    }, [])

    return <Card className="mx-auto" id="question-card">
        <Card.Body>
            <Card.Title className={props.question.min === 0 ? "" : "mandatory"}>
                {props.question.title}
            </Card.Title>
            <Form.Group>
                <Form>
                    {answers.map((a) => <Form.Check
                        type="checkbox"
                        label={a.text}
                        id={a.aID}
                        key={a.aID}
                        onChange={(e) => checkMax(e.target)}
                    />)}
                </Form>
                <Form.Text>A maximum of {props.question.max} answers can be chosen</Form.Text>
            </Form.Group>
        </Card.Body>
    </Card>
}

function SubmitOpenQuestion(props) {

    const handleChange = (e) => {
        let old = props.givenAnswers
    }

    return <Card className="mx-auto" id="question-card">
        <Card.Body>
            <Card.Title className={props.question.min === 0 ? "" : "mandatory"}>
                {props.question.title}
            </Card.Title>
            <Form.Control onChange={(e) => handleChange(e.target.value)} maxLength="200" placeholder="Type your answer here"></Form.Control>
        </Card.Body>
    </Card>
}

function ShowSingleChoiceAnswers(props) {

    const [answers, setAnswers] = useState([])

    useEffect(() => {
        API.loadOfferedAnswers(props.surveyId, props.question.qID).then(dbOfferedAnswers => {
            setAnswers(dbOfferedAnswers)
        })
    }, [])

    return <Card className="mx-auto" id="question-card">
        <Card.Body>
            <Card.Title className={props.question.min === 0 ? "" : "mandatory"}>
                {props.question.title}
            </Card.Title>
            <Form>
                {answers.map((a) => <Form.Check
                    checked={props.answers.filter((ans) => ans.qID === props.question.qID).find((ans) => ans.aID === a.aID) ? true : false}
                    disabled
                    type="radio"
                    label={a.text}
                    id={a.aID}
                    key={a.aID}
                    name="formRadios"
                />)}
            </Form>
        </Card.Body>
    </Card>
}

function ShowMultipleChoiceAnswers(props) {

    const [answers, setAnswers] = useState([])
    const [max, setMax] = useState(0)

    const checkMax = (e) => {
        if (e.checked && max < props.question.max) setMax(old => old + 1)
        else if (!e.checked && max > 0) setMax(old => old - 1)
        if (max === props.question.max)
            console.log(max)
    }

    useEffect(() => {
        API.loadOfferedAnswers(props.surveyId, props.question.qID).then(dbOfferedAnswers => {
            setAnswers(dbOfferedAnswers)
        })
    }, [])

    return <Card className="mx-auto" id="question-card">
        <Card.Body>
            <Card.Title className={props.question.min === 0 ? "" : "mandatory"}>
                {props.question.title}
            </Card.Title>
            <Form.Group>
                <Form>
                    {answers.map((a) => <Form.Check
                        disabled
                        checked={props.answers.filter((ans) => ans.qID === props.question.qID).find((ans) => ans.aID === a.aID) ? true : false}
                        type="checkbox"
                        label={a.text}
                        id={a.aID}
                        key={a.aID}
                        onChange={(e) => checkMax(e.target)}
                    />)}
                </Form>
                <Form.Text>A maximum of {props.question.max} answers can be chosen</Form.Text>
            </Form.Group>
        </Card.Body>
    </Card>
}

function ShowOpenAnswers(props) {

    let text = props.answers.filter((ans) => ans.qID === props.question.qID)[0].text

    return <Card className="mx-auto" id="question-card">
        <Card.Body>
            <Card.Title className={props.question.min === 0 ? "" : "mandatory"}>
                {props.question.title}
            </Card.Title>
            <Form.Control disabled maxLength="200" value={text!==null ? text : ""}></Form.Control>
        </Card.Body>
    </Card>
}

export { QuestionCardAdmin, QuestionCard };