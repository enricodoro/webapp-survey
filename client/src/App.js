import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { GiWaveSurfer } from "react-icons/gi";
import { useEffect, useState } from 'react'
import { Container, Navbar, Button, Row, Col, Card, ListGroup, ButtonGroup } from 'react-bootstrap'
import { BrowserRouter as Router, Switch, Route, Redirect, useParams } from 'react-router-dom'
import TitleBar from './TitleBar.js'
import SurveyCard from './SurveyCard.js'
import NewSurvey from './NewSurvey.js'
import SubmitSurvey from './SubmitSurvey.js'
import API from './API';

function App() {
  const [surveys, setSurveys] = useState([])

  useEffect(() => {
    API.loadSurveys().then(dbSurveys => {
      setSurveys(dbSurveys)
    })
  }, [])

  return (
    <Router>
      <TitleBar />
      <Container id="container">
        <Switch>
          <Route path="/home" exact render={() =>
            //to do admin home
            <></>
          }>
          </Route>
          <Route path="/new-survey" exact render={() =>
            <NewSurvey></NewSurvey>
          }>
          </Route>
          <Route path="/" exact render={() =>
            <Row className="justify-content-center" xs={1} md={2}>
              {surveys.map((s) => <SurveyCard key={s.id} id={s.id} title={s.title} description={s.description} />)}
            </Row>}>
          </Route>
          <Route path="/survey" exact render={({location}) =>
            <SubmitSurvey surveyId={location.state.id}/>
          }>
          </Route>
        </Switch>
      </Container>
    </Router>
  );
}

export default App;
