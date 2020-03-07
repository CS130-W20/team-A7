import React, { Component } from 'react';

import TripTabs from './TripTabs';
import { airports } from "../TripGeneration/airport.js";

const INITIAL_STATE = {
  trips: [],
  error: null,
};

class MyTripsBase extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  render() {
    return(
      <div id="centered-masthead">
        <TripTabs/>
      </div>
    );
  }
}

const MyTrips = MyTripsBase;

export default MyTrips;