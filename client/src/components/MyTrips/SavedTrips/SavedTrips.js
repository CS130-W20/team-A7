import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { withFirebase } from '../../Firebase';
import { AuthUserContext } from '../../Session';

import SavedTripCard from './SavedTripCard';

const INITIAL_STATE = {
  user: null,
  trips: [],
  gotContext: false,
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
  }

  componentDidUpdate() {
    if (typeof this.context.authUser !== 'undefined' && this.context.authUser !== null && !this.state.gotContext) {
      this.hello = this.context;
      this.setState({ gotContext: true });
      this.refreshSavedTrips(this.hello.authUser);
      // console.log('yeet (saved): ', this.context);
    }
  }
  
  getAllSavedTrips(tripIds) {
    const tripRef = this.props.firebase.savedTrip;
    return Promise.all(
      tripIds.map(function(tripId) {
        return new Promise(function(resolve, reject) {
          try {    
            tripRef(tripId).on("value", function(snapshot, prevChildKey) {
              if (typeof snapshot.val() === 'undefined' || snapshot.val() === null) {
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

  getUserSavedTripIds(userId) {
    const currentUserTripsRef = this.props.firebase.singleUserSavedTrips(userId);
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
  getUserSavedTrips(authUser) {
    const getAllSavedTrips = ((tripIds) => this.getAllSavedTrips(tripIds));
    const getUserSavedTripIds = ((uid) => this.getUserSavedTripIds(uid));
    
    return new Promise(function (resolve, reject) {
      getUserSavedTripIds(authUser.uid).then(function (result) {
        if (typeof result.userTrips !== 'undefined' && result.userTrips !== null) {
          let userTrips = [];
          // userTrips is all the user's tripIds
          for (const [key, tripId] of Object.entries(result.userTrips)) {
            userTrips.push(tripId);
          }
          const tripPromises = getAllSavedTrips(userTrips);
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
  setSavedTrips(trips) {
    if (typeof trips === 'undefined' || trips !== null) {
      var tripItems = [];
      for (const trip of trips) {
        var tripItem = new SavedTripsItem(trip, tripItems.length);
        tripItems.push(tripItem);
      }
      this.setState({
        trips: tripItems,
      });
    }
  }

  // Get the full list of user trips
  refreshSavedTrips(authUser) {
    if (typeof authUser !== 'undefined' && authUser) {
      var setSavedTrips_c = ((trips) => this.setSavedTrips(trips));
      this.getUserSavedTrips(authUser).then(function (result) {
        setSavedTrips_c(result);
      });
    }
    else {
      console.log('debug: ', 'auth user still null');
    }
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

SavedTripsBase.contextType = AuthUserContext;

const SavedTrips = compose(
  withRouter,
  withFirebase,
)(SavedTripsBase);

export default SavedTrips;