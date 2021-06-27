import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'

import { useEffect, useState } from 'react'
import { Container, Row, Toast } from 'react-bootstrap'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import TitleBar from './TitleBar.js'
import SurveyCard from './SurveyCard.js'
import NewSurvey from './NewSurvey.js'
import SubmitSurvey from './SubmitSurvey.js'
import Home from './Home.js'
import API from './API'

function App() {
  const [surveys, setSurveys] = useState([])
  const [loggedIn, setLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  const [adminID, setAdminID] = useState(-1)
  const [message, setMessage] = useState('')

  const handleErrors = (err) => {
    setMessage({ msg: err.error, type: 'danger' })
  }

  useEffect(() => {
    API.loadSurveys().then(dbSurveys => {
      setSurveys(dbSurveys)
    }).catch(e => handleErrors(e))
  }, [loggedIn])

  return (
    <Router>
      <TitleBar loggedIn={loggedIn} setLoggedIn={setLoggedIn} username={username} setUsername={setUsername} setAdminID={setAdminID} />
      <Container fluid className="d-flex flex-column mx-auto" id="container">
        <Switch>

          <Route path="/home" exact render={() =>
            <>
              {loggedIn ? <Home admin={username} /> : <Redirect to="/" />}
            </>
          } />

          <Route path="/new-survey" render={() =>
            <>
              {loggedIn ? <NewSurvey adminID={adminID} /> : <Redirect to="/" />}
            </>
          } />

          <Route path="/" exact render={() =>
            <>
              {!loggedIn ? <>
                <Toast show={message !== ''} onClose={() => setMessage('')} delay={3000} autohide>
                  <Toast.Body>{message?.msg}</Toast.Body>
                </Toast>
                <Row className="d-flex flex-row mx-auto" style={{ width: "40%" }}>
                  {surveys.map((s, i) => <SurveyCard key={i} id={s.sID} title={s.title} description={s.description} />)}
                </Row>
              </>
                : <Redirect to="/home" />}
            </>} />

          <Route path="/survey" exact render={({ location }) =>
            <>
              {!loggedIn ? <SubmitSurvey surveyId={location.state.id} title={location.state.title} /> : <Redirect to="/home" />}
            </>} />

        </Switch>
      </Container>
    </Router>
  )
}

export default App
