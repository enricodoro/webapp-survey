import { Navbar, Button, Tooltip, OverlayTrigger, Toast } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { GiWaveSurfer } from "react-icons/gi"
import { AiOutlineUser } from "react-icons/ai"
import { LoginModal } from './Modal.js'
import API from './API.js'

function TitleBar(props) {
    const [show, setShow] = useState(false)
    const [message, setMessage] = useState('')

    const handleErrors = (err) => {
        setMessage({ msg: err.error, type: 'danger' })
    }

    const doLogIn = async (credentials) => {
        try {
            const userId = await API.logIn(credentials)
            props.setLoggedIn(true)
            return userId
        } catch (err) {
            handleErrors(err)
        }
    }

    const doLogOut = async () => {
        await API.logOut().catch(e => handleErrors(e))
        props.setAdminID(-1)
        props.setUsername("")
        props.setLoggedIn(false)
    }

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const user = await API.getAdmin()
                props.setUsername(user.username)
                props.setLoggedIn(true)
            }
            catch (err) {
                console.error(err.error);
            }
        }
        checkAuth()
    }, [])

    useEffect(() => {
        if (props.loggedIn) {
            API.getAdmin().then(user => {
                props.setUsername(user.username)
                props.setAdminID(user.id)
            }).catch(e => handleErrors(e))
        }
    }, [props.loggedIn])

    return <Navbar id="navbar">
        <Navbar.Brand style={{ color: "crimson" }} href="/">
            <GiWaveSurfer id="logo" size="32" />{' '}
            Surfeys
        </Navbar.Brand>
        <Toast show={message !== ''} onClose={() => setMessage('')} delay={3000} autohide>
            <Toast.Body>{message?.msg}</Toast.Body>
        </Toast>
        {props.loggedIn ? <ShowUsername doLogOut={doLogOut} username={props.username} /> : <LoginButton setShow={setShow} />}
        <LoginModal show={show} setShow={setShow} login={doLogIn} loggedIn={props.loggedIn} />
    </Navbar>
}

function LoginButton(props) {
    return <Button id="login" onClick={() => props.setShow(true)}>
        Login
    </Button>
}

function ShowUsername(props) {
    return <OverlayTrigger
        placement="bottom"
        delay={{ show: 250, hide: 400 }}
        overlay={<Tooltip id="tooltip-logout">Logout</Tooltip>}
    >
        <Link style={{ textDecoration: 'none' }} to={{
            pathname: "/"
        }}>
            <Navbar.Brand onClick={() => props.doLogOut()}>
                Welcome {props.username}!{' '}
                <AiOutlineUser id="logo" size="32" />
            </Navbar.Brand>
        </Link>
    </OverlayTrigger>
}

export default TitleBar