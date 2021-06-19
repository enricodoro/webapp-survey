import { Modal, Button, Form, InputGroup } from 'react-bootstrap'
import { useState } from 'react'

function LoginModal(props) {

    const [errorMessage, setErrorMessage] = useState('');
    const [validated, setValidated] = useState(false)
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const handleUsername = (val) => {
        setUsername(val)
    }

    const handlePassword = (val) => {
        setPassword(val)
    }

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }

        event.preventDefault();
        setErrorMessage('');
        const credentials = { username, password };

        let valid = true;
        if (username === '' || password === '' || password.length < 6)
            valid = false;

        if (valid) {
            props.login(credentials);
            props.setShow(false)
        }
        else {
            // show a better error message...
            setErrorMessage('Incorrect username and/or password, please fix it.')
        }

        setValidated(true);
    };

    return <Modal
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={props.show}
    >
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Modal.Header closeButton onClick={() => props.setShow(false)}>
                <Modal.Title id="contained-modal-title-vcenter">
                    Login to create your surveys!
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group>
                    <InputGroup hasValidation>
                        <InputGroup.Prepend>
                            <InputGroup.Text style={{width: "7rem"}} id="prependUsername">Username</InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control
                            required
                            id="username"
                            name="username"
                            type="text"
                            onChange={(e) => handleUsername(e.target.value)}
                            value={username}
                        />
                    </InputGroup>
                </Form.Group>
                <Form.Group>
                    <InputGroup hasValidation>
                        <InputGroup.Prepend> 
                            <InputGroup.Text style={{width: "7rem"}} id="prependPassword">Password</InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control
                            required
                            type="password"
                            id="password"
                            onChange={(e) => handlePassword(e.target.value)}
                            value={password}
                        />
                    </InputGroup>
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button type="submit" variant="success">Login</Button>
            </Modal.Footer>
        </Form>
    </Modal>


}

export { LoginModal }