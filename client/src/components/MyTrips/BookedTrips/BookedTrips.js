import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { withFirebase } from '../../Firebase';
import { AuthUserContext } from '../../Session';

import BookedTripCard from './BookedTripCard';

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
  }

  componentDidUpdate() {
    if (typeof this.context.authUser !== 'undefined' && this.context.authUser !== null && !this.state.gotContext) {
      this.hello = this.context;
      this.setState({ gotContext: true });
      this.refreshBookedTrips(this.hello.authUser);
    }
  }

  getAllBookedTrips(tripIds) {
    const tripRef = this.props.firebase.bookedTrip;
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
  
  getUserBookedTripIds(userId) {
    const currentUserTripsRef = this.props.firebase.singleUserBookedTrips(userId);
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
  getUserBookedTrips(authUser) {
    const getAllBookedTrips = ((tripIds) => this.getAllBookedTrips(tripIds));
    const getUserBookedTripIds = ((uid) => this.getUserBookedTripIds(uid));
    
    return new Promise(function (resolve, reject) {
      getUserBookedTripIds(authUser.uid).then(function (result) {
        if (typeof result.userTrips !== 'undefined' && result.userTrips !== null) {
          let userTrips = [];
          // userTrips is all the user's tripIds
          for (const [key, tripId] of Object.entries(result.userTrips)) {
            userTrips.push(tripId);
          }
          const tripPromises = getAllBookedTrips(userTrips);
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
  setBookedTrips(trips) {
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
  refreshBookedTrips(authUser) {
    if (typeof authUser !== 'undefined' && authUser) {
      var setBookedTrips_c = ((trips) => this.setBookedTrips(trips));
      this.getUserBookedTrips(authUser).then(function (result) {
        setBookedTrips_c(result);
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