import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { useEffect, useState } from 'react'
import { Container, Col } from 'react-bootstrap'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import TitleBar from './TitleBar.js'
import SurveyCard from './SurveyCard.js'
import NewSurvey from './NewSurvey.js'
import SubmitSurvey from './SubmitSurvey.js'
import Home from './Home.js'
import API from './API';

function App() {
  const [surveys, setSurveys] = useState([])
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    API.loadSurveys().then(dbSurveys => {
      setSurveys(dbSurveys)
    })
  }, [])

  return (
    <Router>
      <TitleBar loggedIn={loggedIn} setLoggedIn={setLoggedIn} username={username} setUsername={setUsername} />
      <Container fluid className="d-flex flex-column mx-auto" id="container">
        <Switch>

          <Route path="/home" exact render={() =>
            <>
              {loggedIn ? <Home admin={username} /> : <Redirect to="/" />}
            </>
          } />

          <Route path="/new-survey" render={() =>
            <>
              {loggedIn ? <NewSurvey /> : <Redirect to="/" />}
            </>
          } />

          <Route path="/" exact render={() =>
            <>
              {!loggedIn ?
                <Col md={12} className="d-flex flex-column mx-auto" style={{width: "60%"}}>
                  {surveys.map((s, i) => <SurveyCard key={i} id={s.sID} title={s.title} description={s.description} />)}
                </Col>
                : <Redirect to="/home" />}
            </>} />

          <Route path="/survey" exact render={({ location }) =>
            <>
              {!loggedIn ? <SubmitSurvey surveyId={location.state.id} title={location.state.title} /> : <Redirect to="/home" />}
            </>} />

        </Switch>
      </Container>
    </Router>
  );
}

export default App;
