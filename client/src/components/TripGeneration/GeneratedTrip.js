import React, { Component } from 'react';

class GeneratedTrip extends Component {
  constructor(props) {
    super(props);
  }
  
  continue = e => {
    e.preventDefault();
    this.props.nextStep();
  };

  render() {
    const { values, handleChange, classes } = this.props;
    
    return (
      <div>
        <h1> Generated Trip </h1>
        <p> {values.departureAirport.code} </p>
        <p> {values.departureDate} </p>
        <p> {values.returnDate} </p>
      </div>
    );
  }
}
export default GeneratedTrip;