import React, { Component } from 'react'
import { Button, FormGroup } from 'react-bootstrap'

export class TrainBox extends Component {
  constructor(props) {
    super(props)
    this.handleForm = this.handleForm.bind(this)
    this.handleDay = this.handleDay.bind(this)
    this.handleHour = this.handleHour.bind(this)
    this.handleMinute = this.handleMinute.bind(this)
    this.handleName = this.handleName.bind(this)
    this.handleBird = this.handleBird.bind(this)
    this.state = {
      disabled: false,
      answer: '',
      day: '',
      hour: '',
      minutes: '',
      bird: '',

    }
  }

  handleForm(e) {
    e.preventDefault();
    console.log(this.state)
    fetch('/predict-bird', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        day: this.state.day,
        hour: this.state.hour,
        minutes: this.state.minute,
      })
    }).then((response) => response.json())
      .then((data) => this.setState({output_bird: data.result}))
  }

  handleBird(e) {
    this.setState({bird: e.target.value})
  }

  handleName(e) {
    e.preventDefault();
    fetch('/predict-time', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: this.state.bird,
      })
    }).then((response) => response.json())
      .then((data) => this.setState({output_time: data.time_result, output_day: data.r_day}))
  }

  handleDay(e) {
    this.setState({day: e.target.value})
  }

  handleHour(e) {
    this.setState({hour: e.target.value})
  }

  handleMinute(e) {
    this.setState({minute: e.target.value})
  }

  render() {
    return (
      <div className="div2">
        <div className="predictionForm">
          <h3> Prediction </h3>
          <p> Algorithm Predicted that at this time we will see = <b>{this.state.output_bird}</b>  </p>
          <form onSubmit={this.handleForm}>
            <FormGroup>
              <input
                className="form-control"
                type="text"
                placeholder="Day of the week"
                onChange={this.handleDay}
              />
            </FormGroup>
            <FormGroup>
              <input
                className="form-control"
                type="text"
                placeholder="Hour of the day in 24hrs format"
                onChange={this.handleHour}
              />
            </FormGroup>
            <FormGroup>
              <input
                className="form-control"
                type="text"
                placeholder="Minutes of the day"
                onChange={this.handleMinute}
              />
            </FormGroup>
            <Button id="submit" bsStyle="primary" bsSize="large" type="submit">Submit</Button>
          </form>
        </div>
        <div id='predictname'>
          <h3> Predict By Name </h3>
          <p> Algorithm Predicted that it is likely to see the bird during <b>{this.state.output_day}</b> at <b>{this.state.output_time}</b> </p>
          <form onSubmit={this.handleName}>
            <FormGroup>
              <input
                className="form-control"
                type="text"
                placeholder="Bird Name"
                onChange={this.handleBird}
              />
            </FormGroup>
            <Button id="submit" bsStyle="primary" bsSize="large" type="submit">Submit</Button>
          </form>
        </div>
      </div>
    )
  }
}

export default TrainBox
