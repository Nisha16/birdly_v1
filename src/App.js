import React, { Component } from 'react';
import './App.css';
import { Button, Grid, Row, Col } from 'react-bootstrap'
import BirdForm from './TestBlock'
import TrainBox from './TrainBox'

class App extends Component {
  render() {
    return (
      <div className="App">
        <div id="navigation">
            Birdly
        </div>
        <Grid fluid={true}>
          <Row>
            <Col md={6}>
              <BirdForm />
            </Col>
            <Col md={6}>
              <TrainBox subreddit={"python"}/>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default App;
