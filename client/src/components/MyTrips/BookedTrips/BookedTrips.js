import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { withFirebase } from '../../Firebase';
import { AuthUserContext } from '../../Session';


import BookedTripCard from './BookedTripCard';
import BookedTrip, {Flight, HotelStay} from './BookedTrip';
import { airports } from "../../TripGeneration/airport.js";
import Button from '@material-ui/core/Button';

const INITIAL_STATE = {
  user: null,
  trips: [],
  gotContext: false,
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
    var departureDate = new Date(2020, 5, 11).toDateString();
    var returnDate = new Date(2020, 5, 16).toDateString();
    var departureFlight = new Flight(
      airports[0].city,
      airports[100].city,
      departureDate,
      'departureAirline',
      {
        name: airports[0].name,
        code: airports[0].code,
      },
      {
        name: airports[100].name,
        code: airports[100].code,
      }
    );
    var returnFlight = new Flight(
      airports[100].city,
      airports[0].city,
      returnDate,
      'returnAirline',
      {
        name: airports[100].name,
        code: airports[100].code,
      },
      {
        name: airports[0].name,
        code: airports[0].code,
      }
    );
    var hotelStay = new HotelStay(
      {
        name: 'Hotel California',
      },
      5,
    );

    this.trip = new BookedTrip('BookedTrip1', departureFlight, returnFlight, hotelStay);
  }

  componentDidUpdate() {
    if (typeof this.context.authUser !== 'undefined' && this.context.authUser !== null && !this.state.gotContext) {
      this.hello = this.context;
      this.setState({ gotContext: true });
      this.refreshTrips(this.hello.authUser);
      console.log('yeet: ', this.context);
    }
  }

  writeToTrips(userId, newTrip) {
    const tripsRef = this.props.firebase.trips();
    const newTripRef = tripsRef.push();
    newTripRef.set(newTrip, function(error) {
      if (error) {
        console.log('Error: Failed to write trip to user ', userId, ': ', error);
      }
    });
    return newTripRef.key;
  }

  writeToUserTrips(userId, tripId) {
    const currentUserTripsRef = this.props.firebase.singleUserTrips(userId);
    const newIndex = currentUserTripsRef.push();
    newIndex.set(tripId);
  }

  onClick = (userId) => {
    if (userId !== null) {
      // Write the trip to trips first, then to userTrips
      const newTripKey = this.writeToTrips(userId, this.trip);
      if (typeof newTripKey !== 'undefined') {
        this.writeToUserTrips(userId, newTripKey);
      }
      else {
        console.log('Error: ', 'Did not write to user trips, new trip key was undefined');
      }
    }
  }

  getSingleTrip(tripId) {
    const tripRef = this.props.firebase.trip(tripId);
    return new Promise(function (resolve, reject) {
      try {    
        tripRef.once("value", function(snapshot, prevChildKey) {
          if (typeof snapshot.val().name === 'undefined') {
            resolve(null);
          } else {
            var newTrip = snapshot.val();
            resolve(newTrip);
          }
        })
      } catch (e) {
        reject(e)
      }
    });
  }

  getAllTrips(tripIds) {
    const tripRef = this.props.firebase.trip;
    return Promise.all(
      tripIds.map(function(tripId) {
        return new Promise(function(resolve, reject) {
          try {    
            tripRef(tripId).on("value", function(snapshot, prevChildKey) {
              if (typeof snapshot.val().name === 'undefined') {
                resolve(null);
              } else {
                var newTrip = snapshot.val();
                resolve(newTrip);
              }
            })
          } catch (e) {
            reject(e)
          }
        })
      })
    );
  }
  
  getUserTripIds(userId) {
    const currentUserTripsRef = this.props.firebase.singleUserTrips(userId);
    return new Promise(function (resolve, reject) {
      try {
        currentUserTripsRef.on("value", function(snapshot, prevChildKey) {
            if (typeof snapshot.val() === 'undefined') {
              resolve(null);
            } else {
              var userTrips = snapshot.val();
              resolve({
                userTrips: userTrips,
              });
            }
        })
      } catch (e) {
          reject(e)
      }
    });
  }

  // Query for the trip ids, then the trip objects
  getUserTrips(authUser) {
    const getAllTrips = ((tripIds) => this.getAllTrips(tripIds));
    const getUserTripIds = ((uid) => this.getUserTripIds(uid));
    
    return new Promise(function (resolve, reject) {
      getUserTripIds(authUser.uid).then(function (result) {
        if (typeof result.userTrips !== 'undefined' && result.userTrips !== null) {
          let userTrips = [];
          // userTrips is all the user's tripIds
          for (const [key, tripId] of Object.entries(result.userTrips)) {
            userTrips.push(tripId);
          }
          const tripPromises = getAllTrips(userTrips);
          tripPromises.then(function (values) {
            resolve(values)
          }).catch(function (error) {
            resolve(null);
            console.log('debug: ', error);
          });
        }
      }).catch(function (error) {
        resolve(null);
        console.log('debug: ', error);
      });
    });
  }

  // Set the trips in state
  setTrips(trips) {
    if (typeof trips === 'undefined' || trips !== null) {
      var tripItems = [];
      for (const trip of trips) {
        var tripItem = new BookedTripsItem(trip, tripItems.length);
        tripItems.push(tripItem);
      }
      this.setState({
        trips: tripItems,
      });
    }
  }

  // Get the full list of user trips
  refreshTrips(authUser) {
    if (typeof authUser !== 'undefined' && authUser) {
      var setTrips_c = ((trips) => this.setTrips(trips));
      this.getUserTrips(authUser).then(function (result) {
        setTrips_c(result);
      });
    }
    else {
      console.log('debug: ', 'auth user still null');
    }
  }

  render() {
    return(
      <div>
        <div>
          {(this.state.trips || []).map(listItem => (
            <div key={listItem.key} style={{padding: 25}}>
              <BookedTripCard trip={listItem.trip}/>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

BookedTripsBase.contextType = AuthUserContext;

const BookedTrips = compose(
  withRouter,
  withFirebase,
)(BookedTripsBase);

export default BookedTrips;