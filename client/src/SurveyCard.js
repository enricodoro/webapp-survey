import { Card, Nav, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'

function SurveyCard(props) {

  return <Card id="survey-card">
    <Card.Body>
      <Card.Title>{props.title}</Card.Title>
      <Card.Text>{props.description}</Card.Text>
      <Link to={{
        pathname: "/survey",
        state: { id: props.id }
      }}>
        <Button id="button">
          Answer
        </Button>
      </Link>
    </Card.Body>
  </Card>
}

export default SurveyCard;