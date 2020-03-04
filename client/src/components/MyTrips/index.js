import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

import TripCard from './TripCard';

const INITIAL_STATE = {
  tripCards: [],
  error: null,
};

class MyTripsBase extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }
  render() {
    return(
      <div>
        <h1>My Trips</h1>

      </div>
    );
  }
}

const MyTrips = compose(
  withRouter,
  withFirebase,
)(MyTripsBase);

export default MyTrips;