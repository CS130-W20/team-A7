import React, { Component } from 'react';
import { BrowserRouter, Redirect, Route, Switch, Link, NavLink } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';

class Price extends Component {
  constructor(props) {
    super(props);
    this.state = props.state;
  }
  
  render() {
    const {
      departureAirport,
      departureDate,
      returnDate,
      cheapest,
      underBudget,
      farthest,
      withinUS,
      international,
      error,
    } = this.state;
    
    console.log("hewwo", departureAirport, departureDate, returnDate);
    return (
    <div>
        <h1>Price page here after Generate Trip is smashed</h1>
    </div>);
  }
};
export default Price;