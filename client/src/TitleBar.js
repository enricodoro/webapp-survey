import { GiWaveSurfer } from "react-icons/gi";
import { useEffect, useState } from 'react'
import { Container, Navbar, Button, Row } from 'react-bootstrap'

function TitleBar(props) {
    return  <Navbar id="navbar">
                <Navbar.Brand style={{ color: "crimson" }} href="/">
                    <GiWaveSurfer id="logo" size="32"/>{' '}
                    Surfeys
                </Navbar.Brand>
                <Button id="button">
                    Login as admin
                </Button>
            </Navbar>
}

export default TitleBar;