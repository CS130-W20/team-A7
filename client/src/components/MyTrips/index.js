import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

import TripCard from './TripCard';
import Trip, {Flight, HotelStay} from './Trip';

import { airports } from "../TripGeneration/airport.js";

const INITIAL_STATE = {
  trips: [],
  error: null,
};

class MyTripsBase extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
    console.log("testing: ", airports[0].code);
    // Creating trips
    var departureDate = new Date(2020, 2, 24);
    var returnDate = new Date(2020, 3, 24);
    var departureFlight = new Flight(airports[0].city, airports[100].city, departureDate, airports[0], airports[100]);
    var returnFlight = new Flight(airports[100].city, airports[0].city, returnDate, airports[100], airports[0]);
    var hotelStay = new HotelStay('hotelId:1', departureDate, returnDate)
    var trip = new Trip('Trip1', departureFlight, returnFlight, hotelStay);

    // Creating list
    this.state.trips.push(trip);
  }

  render() {
    return(
      <div>
        {(this.state.trips || []).map(item => (
          <div key={0} style={{padding: 25}}>
            <TripCard trip={item}/>
          </div>
        ))}
      </div>
    );
  }
}

const MyTrips = compose(
  withRouter,
  withFirebase,
)(MyTripsBase);

export default MyTrips;