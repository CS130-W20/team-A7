import React, { Component } from 'react';

class Price extends Component {
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
        <h1> Price for... </h1>
        { values.departureAirport.code } <br/>
        { values.departureDate.toDateString() } <br/>
        { values.returnDate.toDateString() } <br/>
        { (values.cheapest ? "cheapest\n" : "") } <br/>
        { (values.underBudget ? "under budget\n" : "") } <br/>
        { (values.farthest ? "farthest\n" : "") } <br/>
        { (values.withinUS ? "within u.s.\n" : "") } <br/>
        { (values.international ? "international\n" : "") }
      </div>
    );
  }
}
export default Price;