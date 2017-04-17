import React, { Component } from 'react'
import { FormGroup, Button } from 'react-bootstrap'
import Datetime from 'react-datetime'

export class BirdForm extends Component {
  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleDate = this.handleDate.bind(this)
    this.handleBird = this.handleBird.bind(this)
    this.handleTrain = this.handleTrain.bind(this)
    this.state = {
      moment: '',
      bird: '',
      date: '',
      training: false,
    }
  }

  handleTrain(e) {
    e.preventDefault();
    this.setState({training:true})
    fetch('/train', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
  }).then((response) => response.json())
    .then((data) => this.setState({training: false}))
  }

  handleSubmit(e) {
    console.log(e);
    console.log(this.state.bird);
    e.preventDefault();
    fetch('/submit', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bird: this.state.bird.toLowerCase(),
        date: this.state.date,
      })
  })
  }

  handleDate(dateobj) {
    console.log(dateobj)
    this.setState({date: dateobj.format()})
  }

  handleBird(event) {
    this.setState({bird: event.target.value})
  }

  render() {
    let train_button = null;
    if (this.state.training === "training") {
      train_button = <Button id="submit" bsStyle="primary" bsSize="large" onClick={this.handleTrain} disabled="true">Training Please Wait </Button>
    } else {
      train_button = <Button id="submit" bsStyle="primary" bsSize="large" onClick={this.handleTrain}>Train</Button>
    }
    return (
      <div className="textblock">
        <h3> Input </h3>
        <form onSubmit={this.handleSubmit}>
          <FormGroup>
            <input
              className="form-control"
              type="text"
              placeholder="Bird Name"
              onChange={this.handleBird}
            />
          </FormGroup>
          <FormGroup>
            <Datetime onChange={this.handleDate} inputProps={{placeholder:"Enter Date and Time"}}/>
          </FormGroup>
          <Button id="submit" bsStyle="primary" bsSize="large" type="submit">Submit</Button>
        </form>
        <div className="train">
          <h3> Train Your Algorithm </h3>
          {train_button}
        </div>
      </div>
    )
  }
}

export default BirdForm;
