import { Card, Button, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'

function SurveyCard(props) {

  return <Col lg={12} className="d-flex flex-column mr-auto">
    <Card className="mx-auto" id="survey-card">
      <Card.Body>
        <Card.Title>{props.title}</Card.Title>
        <Card.Text>{props.description}</Card.Text>
        <Link style={{ textDecoration: 'none' }} to={{
          pathname: "/survey",
          state: { id: props.id, title: props.title }
        }}>
          <Button id="button">
            Answer
          </Button>
        </Link>
      </Card.Body>
    </Card>
  </Col>
}

export default SurveyCard