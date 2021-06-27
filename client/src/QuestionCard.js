import { Card, Form, Button, ButtonGroup, Col, Row, Toast } from "react-bootstrap"
import { useState, useEffect } from "react"
import { FiArrowDown, FiArrowUp } from "react-icons/fi"
import { AiOutlineDelete } from "react-icons/ai"
import API from './API'

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
                            custom
                            className="checkAnswer"
                            type="radio"
                            label={a}
                            id={`${props.question.qID}${i}`}
                            key={`${props.question.qID}${i}`}
                            name={"formRadio-" + props.question.qID}
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
                            custom
                            className="checkAnswer"
                            type="checkbox"
                            label={a}
                            id={`${props.question.qID}${i}`}
                            key={`${props.question.qID}${i}`}
                            name={"formCheck-" + props.question.qID}
                            disabled
                        />)}
                    </Form>
                    {props.question.min !== 0
                        ? props.question.min === 1
                            ? <Form.Text>At least {props.question.min} answer must be chosen, but not more than {props.question.max}.</Form.Text>
                            : props.question.min !== props.question.max
                                ? <Form.Text>At least {props.question.min} answers must be chosen, but not more than {props.question.max}.</Form.Text>
                                : <Form.Text>You have to choose {props.question.min} answers.</Form.Text>
                        : <Form.Text>A maximum of {props.question.max} answers can be chosen.</Form.Text>}
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
                    <Form.Control disabled />
                    <Form.Text>0/200</Form.Text>
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
        return props.admin ? <ShowOpenAnswers question={props.question} answers={props.answers} /> : <SubmitOpenQuestion question={props.question} setRequired={props.setRequired} givenAnswers={props.givenAnswers} setGivenAnswers={props.setGivenAnswers} />
    else
        if (props.question.max === 1)
            return props.admin ? <ShowSingleChoiceAnswers question={props.question} surveyId={props.surveyId} answers={props.answers} /> : <SubmitSingleChoiceQuestion question={props.question} setRequired={props.setRequired} givenAnswers={props.givenAnswers} setGivenAnswers={props.setGivenAnswers} surveyId={props.surveyId} />
        else
            return props.admin ? <ShowMultipleChoiceAnswers question={props.question} surveyId={props.surveyId} answers={props.answers} /> : <SubmitMultipleChoiceQuestion question={props.question} setRequired={props.setRequired} givenAnswers={props.givenAnswers} setGivenAnswers={props.setGivenAnswers} surveyId={props.surveyId} />
}

function SubmitSingleChoiceQuestion(props) {

    const [answers, setAnswers] = useState([])
    const [message, setMessage] = useState('')

    const handleErrors = (err) => {
        setMessage({ msg: err.error, type: 'danger' })
    }

    const handleChange = (id) => {
        let ans = { qID: props.question.qID, aID: id - 1, text: null }
        if (props.givenAnswers.find((a) => a.qID === ans.qID)) {
            props.setGivenAnswers(old => old.filter((a) => (a.qID !== ans.qID)))
            props.setGivenAnswers(old => [...old, ans])
        }
        else {
            if (props.question.min >= 1) props.setRequired(old => old + 1)
            props.setGivenAnswers(old => [...old, ans])
        }
    }

    useEffect(() => {
        API.loadOfferedAnswers(props.surveyId, props.question.qID).then(dbOfferedAnswers => {
            setAnswers(dbOfferedAnswers)
        }).catch(e => handleErrors(e))
    }, [])

    return <>
        <Toast show={message !== ''} onClose={() => setMessage('')} delay={3000} autohide>
            <Toast.Body>{message?.msg}</Toast.Body>
        </Toast>
        <Card className="mx-auto" id="question-card">
            <Card.Body>
                <Card.Title className={props.question.min === 0 ? "" : "mandatory"}>
                    {props.question.title}
                </Card.Title>
                <Form>
                    {answers.map((a, i) => <Form.Check
                        custom
                        className="checkAnswer"
                        type="radio"
                        label={a.text}
                        id={`${props.question.qID}${i}`}
                        key={`${props.question.qID}${i}`}
                        name={"formRadio-" + props.question.qID}
                        onChange={() => handleChange(i + 1)}
                    />)}
                </Form>
            </Card.Body>
        </Card>
    </>
}

function SubmitMultipleChoiceQuestion(props) {

    const [answers, setAnswers] = useState([])
    const [checked, setChecked] = useState([])
    const [flag, setFlag] = useState(false)
    const [message, setMessage] = useState('')

    const handleErrors = (err) => {
        setMessage({ msg: err.error, type: 'danger' })
    }

    const handleChange = (e, id) => {
        let ans = { qID: props.question.qID, aID: id - 1, text: null }
        if (props.givenAnswers.find((a) => a.qID === ans.qID && a.aID === ans.aID)) {
            if (props.question.min >= 1 && props.givenAnswers.filter((a) => a.qID === ans.qID).length <= props.question.min && !flag) {
                props.setRequired(old => old - 1)
                setFlag(true)
            }
            props.setGivenAnswers(old => old.filter((a) => (a.qID !== ans.qID) || (a.qID === ans.qID && a.aID !== ans.aID)))
        }
        else {
            if (props.question.min >= 1 && props.givenAnswers.filter((a) => a.qID === ans.qID).length === props.question.min - 1) {
                props.setRequired(old => old + 1)
                setFlag(false)
            }
            props.setGivenAnswers(old => [...old, ans])
        }
        if (e.checked) {
            setChecked(old => [...old, id - 1])
        } else {
            let tmp = [...checked]
            setChecked(tmp.filter((c) => c !== id - 1))
        }
    }

    useEffect(() => {
        API.loadOfferedAnswers(props.surveyId, props.question.qID).then(dbOfferedAnswers => {
            setAnswers(dbOfferedAnswers)
        }).catch(e => handleErrors(e))
    }, [])

    return <>
        <Toast show={message !== ''} onClose={() => setMessage('')} delay={3000} autohide>
            <Toast.Body>{message?.msg}</Toast.Body>
        </Toast>
        <Card className="mx-auto" id="question-card">
            <Card.Body>
                <Card.Title className={props.question.min === 0 ? "" : "mandatory"}>
                    {props.question.title}
                </Card.Title>
                <Form.Group>
                    <Form>
                        {answers.map((a, i) => <Form.Check
                            custom
                            className="checkAnswer"
                            disabled={checked.length >= props.question.max && !checked.includes(i)}
                            type="checkbox"
                            label={a.text}
                            id={`${props.question.qID}${i}`}
                            key={`${props.question.qID}${i}`}
                            name={"formCheck-" + props.question.qID}
                            onChange={(e) => handleChange(e.target, i + 1)}
                        />)}
                    </Form>
                    {props.question.min !== 0
                        ? props.question.min === 1
                            ? <Form.Text>At least {props.question.min} answer must be chosen, but not more than {props.question.max}.</Form.Text>
                            : props.question.min !== props.question.max
                                ? <Form.Text>At least {props.question.min} answers must be chosen, but not more than {props.question.max}.</Form.Text>
                                : <Form.Text>You have to choose {props.question.min} answers.</Form.Text>
                        : <Form.Text>A maximum of {props.question.max} answers can be chosen.</Form.Text>}
                </Form.Group>
            </Card.Body>
        </Card>
    </>
}

function SubmitOpenQuestion(props) {

    const [text, setText] = useState("")
    const [flag, setFlag] = useState(true)

    const handleChange = (e) => {
        setText(e)
    }

    useEffect(() => {
        let ans = { qID: props.question.qID, text: text, aID: null }
        if (props.givenAnswers.find((a) => a.qID === ans.qID)) {
            if (props.question.min >= 1) {
                if (text.length === 0) {
                    setFlag(true)
                    props.setRequired(old => old - 1)
                }
                else if (text.length > 0 && flag) {
                    setFlag(false)
                    props.setRequired(old => old + 1)
                }
            }
            let newAns = [...props.givenAnswers]
            newAns.find((a) => a.qID === ans.qID).text = ans.text
            props.setGivenAnswers(newAns)
        }
        else {
            if (props.question.min >= 1 && text.length > 0) {
                setFlag(false)
                props.setRequired(old => old + 1)
            }
            props.setGivenAnswers(old => [...old, ans])
        }
    }, [text])

    return <Card className="mx-auto" id="question-card">
        <Card.Body>
            <Card.Title className={props.question.min === 0 ? "" : "mandatory"}>
                {props.question.title}
            </Card.Title>
            <Form.Control required={props.question.min >= 1} onChange={(e) => handleChange(e.target.value)} maxLength="200" placeholder="Type your answer here"></Form.Control>
            <Form.Text>{text.length}/200</Form.Text>
        </Card.Body>
    </Card>
}

function ShowSingleChoiceAnswers(props) {

    const [answers, setAnswers] = useState([])
    const [message, setMessage] = useState('')

    const handleErrors = (err) => {
        setMessage({ msg: err.error, type: 'danger' })
    }

    useEffect(() => {
        API.loadOfferedAnswers(props.surveyId, props.question.qID).then(dbOfferedAnswers => {
            setAnswers(dbOfferedAnswers)
        }).catch(e => handleErrors(e))
    }, [])

    return <>
        <Toast show={message !== ''} onClose={() => setMessage('')} delay={3000} autohide>
            <Toast.Body>{message?.msg}</Toast.Body>
        </Toast>
        <Card className="mx-auto" id="question-card">
            <Card.Body>
                <Card.Title className={props.question.min === 0 ? "" : "mandatory"}>
                    {props.question.title}
                </Card.Title>
                <Form>
                    {answers.map((a, i) => <Form.Check
                        custom
                        className="checkAnswer"
                        checked={props.answers.filter((ans) => ans.qID === props.question.qID).find((ans) => ans.aID === a.aID) ? true : false}
                        disabled
                        type="radio"
                        label={a.text}
                        id={`${props.question.qID}${i}`}
                        key={`${props.question.qID}${i}`}
                        name={"formRadio-" + props.question.qID}
                    />)}
                </Form>
            </Card.Body>
        </Card>
    </>
}

function ShowMultipleChoiceAnswers(props) {

    const [answers, setAnswers] = useState([])
    const [max, setMax] = useState(0)
    const [message, setMessage] = useState('')

    const handleErrors = (err) => {
        setMessage({ msg: err.error, type: 'danger' })
    }

    const checkMax = (e) => {
        if (e.checked && max < props.question.max) setMax(old => old + 1)
        else if (!e.checked && max > 0) setMax(old => old - 1)
        if (max === props.question.max)
            console.log(max)
    }

    useEffect(() => {
        API.loadOfferedAnswers(props.surveyId, props.question.qID).then(dbOfferedAnswers => {
            setAnswers(dbOfferedAnswers)
        }).catch(e => handleErrors(e))
    }, [])

    return <>
        <Toast show={message !== ''} onClose={() => setMessage('')} delay={3000} autohide>
            <Toast.Body>{message?.msg}</Toast.Body>
        </Toast>
        <Card className="mx-auto" id="question-card">
            <Card.Body>
                <Card.Title className={props.question.min === 0 ? "" : "mandatory"}>
                    {props.question.title}
                </Card.Title>
                <Form.Group>
                    <Form>
                        {answers.map((a, i) => <Form.Check
                            custom
                            className="checkAnswer"
                            disabled
                            checked={props.answers.filter((ans) => ans.qID === props.question.qID).find((ans) => ans.aID === a.aID) ? true : false}
                            type="checkbox"
                            label={a.text}
                            id={`${props.question.qID}${i}`}
                            key={`${props.question.qID}${i}`}
                            name={"formCheck-" + props.question.qID}
                            onChange={(e) => checkMax(e.target)}
                        />)}
                    </Form>
                    {props.question.min !== 0
                        ? props.question.min === 1
                            ? <Form.Text>At least {props.question.min} answer must be chosen, but not more than {props.question.max}.</Form.Text>
                            : props.question.min !== props.question.max
                                ? <Form.Text>At least {props.question.min} answers must be chosen, but not more than {props.question.max}.</Form.Text>
                                : <Form.Text>You have to choose {props.question.min} answers.</Form.Text>
                        : <Form.Text>A maximum of {props.question.max} answers can be chosen.</Form.Text>}
                </Form.Group>
            </Card.Body>
        </Card>
    </>
}

function ShowOpenAnswers(props) {

    let text = props.answers.filter((ans) => ans.qID === props.question.qID)[0].text

    return <Card className="mx-auto" id="question-card">
        <Card.Body>
            <Card.Title className={props.question.min === 0 ? "" : "mandatory"}>
                {props.question.title}
            </Card.Title>
            <Form.Control disabled maxLength="200" value={text !== null ? text : ""}></Form.Control>
            <Form.Text>{text.length}/200</Form.Text>
        </Card.Body>
    </Card>
}

export { QuestionCardAdmin, QuestionCard }