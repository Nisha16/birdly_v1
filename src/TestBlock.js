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
    }
  }

  handleTrain(e) {
    e.preventDefault();
    fetch('/train', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
  });
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
    return (
      <div className="textblock">
        <h3>{this.state.bird} spotted at {this.state.moment} </h3>
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
            <Datetime onChange={this.handleDate}/>
          </FormGroup>
          <Button bsStyle="default" type="submit">Submit</Button>
        </form>
        <div className="train">
          <h3> Train Your Algorithm </h3>
          <Button onClick={this.handleTrain} disabled={this.state.disabled}>Train</Button>
        </div>
      </div>
    )
  }
}

export default BirdForm;
