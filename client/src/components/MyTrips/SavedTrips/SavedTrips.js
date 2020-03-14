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

/** @class SavedTripsItem representing a saved trip */
class SavedTripsItem {
  /**
  * Creates an instance of SavedTripsItem.
  *
  * @constructor
  * @param trip {Trip} The trip object
  * @param key {String} The firebase key associated with this object
  */
  constructor(trip, key) {
    this.trip = trip;
    this.key = key;
  }
}

/** @class SavedTripsBase handling the main rendering of the Saved Trips tab on the My Trips page */
class SavedTripsBase extends Component {
  /**
  * Creates an instance of SavedTripsBase.
  *
  * @constructor
  * @param props {props} React properties
  */
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  /**
  * Sets the state of the object's rendered variables.
  *
  * @param none
  * @return none
  */
  componentDidUpdate() {
    if (typeof this.context.authUser !== 'undefined' && this.context.authUser !== null && !this.state.gotContext) {
      this.hello = this.context;
      this.setState({ gotContext: true });
      this.refreshSavedTrips(this.hello.authUser);
      // console.log('yeet (saved): ', this.context);
    }
  }
  
  /**
  * Gets all of the saved trips
  *
  * @param tripIds {Array<String>} IDs of trips to be obtained from FireBase
  * @return Promise {Promise} A Promise that will eventually return each trip from FireBase.
  */
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

  /**
  * Gets all of the saved trip IDs for a user
  *
  * @param userId {String} ID of user to be sent to FireBase
  * @return Promise {Promise} A Promise that will eventually return each tripID from FireBase.
  */
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

  /**
  * Gets all of the saved trips
  *
  * @param authUser {authUser} User object
  * @return Promise {Promise} A Promise that will eventually return each tripID from FireBase.
  */
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

  /**
  * Sets all of the saved trips
  *
  * @param trips {Array<SavedTripsItem>} trips obtained from FireBase
  * @return none
  */
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

  /**
  * Gets all of the saved trips for a certain user
  *
  * @param authUser {authUser} Object representing a logged in user
  * @return None
  */
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

  /**
  * Renders the component
  *
  * @param none
  * @return HTML {HTML} The HTML representation of the component
  */
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