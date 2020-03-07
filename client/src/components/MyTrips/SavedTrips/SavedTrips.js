import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { compose } from 'recompose';

import { withFirebase } from '../../Firebase';

import SavedTripCard from './SavedTripCard';
import SavedTrip from './SavedTrip';
import Criteria from '../../TripGeneration/Criteria.js'
import { airports } from "../../TripGeneration/airport.js";

const INITIAL_STATE = {
  trips: [],
  error: null,
};

class SavedTripsItem {
  constructor(trip, key) {
    this.trip = trip;
    this.key = key;
  }
}

class SavedTripsBase extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
    // Creating trips
    var departureDate = new Date(2020, 5, 11);
    var returnDate = new Date(2020, 10, 28);
    var savedCriteria = new Criteria(
      airports[48],
      departureDate,
      returnDate,
      true,
      false,
      null,
      true,
      false
    );
    var savedTrip = new SavedTrip(savedCriteria);
    var tripItem = new SavedTripsItem(savedTrip, this.state.trips.length);
    
    // Creating list
    this.state.trips.push(tripItem);
  }

  render() {
    return(
      <div>
        {(this.state.trips || []).map(listItem => (
          <div key={listItem.key} style={{padding: 25}}>
            <SavedTripCard trip={listItem.trip}/>
          </div>
        ))}
      </div>
    );
  }
}

const SavedTrips = compose(
  withRouter,
  withFirebase,
)(SavedTripsBase);

export default SavedTrips;