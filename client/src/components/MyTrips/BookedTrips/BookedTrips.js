import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { compose } from 'recompose';

import { withFirebase } from '../../Firebase';

import BookedTripCard from './BookedTripCard';
import BookedTrip, {Flight, HotelStay} from './BookedTrip';
import { airports } from "../../TripGeneration/airport.js";

const INITIAL_STATE = {
  trips: [],
  error: null,
};

class BookedTripsItem {
  constructor(trip, key) {
    this.trip = trip;
    this.key = key;
  }
}

class BookedTripsBase extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
    // Creating trips
    var departureDate = new Date(2020, 2, 24);
    var returnDate = new Date(2020, 3, 24);
    var departureFlight = new Flight(airports[0].city, airports[100].city, departureDate, airports[0], airports[100]);
    var returnFlight = new Flight(airports[100].city, airports[0].city, returnDate, airports[100], airports[0]);
    var hotelStay = new HotelStay('hotelId:1', departureDate, returnDate)
    var trip = new BookedTrip('BookedTrip1', departureFlight, returnFlight, hotelStay);
    var tripItem = new BookedTripsItem(trip, 0);
    
    // Creating list
    this.state.trips.push(tripItem);
  }

  render() {
    return(
      <div>
        {(this.state.trips || []).map(listItem => (
          <div key={listItem.key} style={{padding: 25}}>
            <BookedTripCard trip={listItem.trip}/>
          </div>
        ))}
      </div>
    );
  }
}

const BookedTrips = compose(
  withRouter,
  withFirebase,
)(BookedTripsBase);

export default BookedTrips;