import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
};
class Firebase {
    constructor() {
      app.initializeApp(config);

      this.auth = app.auth();
      this.db = app.database();
    }

    // @param  email  The email of the user you want to make
    // @param  password  The password of the user you want to make
    // @return  Returns a promise containing the user credentials
    doCreateUserWithEmailAndPassword = (email, password) =>
      this.auth.createUserWithEmailAndPassword(email, password);

    // @param  email  The email of the user you want to sign in
    // @param  password  The password of the user you want to sign in
    // @return  Returns a promise containing the user credentials
    doSignInWithEmailAndPassword = (email, password) =>
      this.auth.signInWithEmailAndPassword(email, password);

    // @return  Returns a void promise
    doSignOut = () => this.auth.signOut();
    
    // @param  email  The email of the user whose password you want to reset
    // @return Returns a void promise
    doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

    // @param  password  The user’s updated password 
    // @return Returns a void promise
    doPasswordUpdate = password =>
      this.auth.currentUser.updatePassword(password);

    // User API
    // @param  uid  The user id of the user being requested
    // @return Returns a reference to the query’s location
    user = uid => this.db.ref(`users/${uid}`);

    // @return Returns a reference to the users location
    users = () => this.db.ref('users');

    // Booked Trips API
    // @param  trip_id  The trip id of the user being requested
    // @return Returns a reference to the query’s location
    bookedTrip = trip => this.db.ref(`bookedTrips/${trip}`);

    // @return Returns a reference to the query’s location
    bookedTrips = () => this.db.ref('bookedTrips');

    // User Booked Trips API
    // @param  uid  The trip id of the user whose trips are being requested
    // @return Returns a reference to the query’s location
    singleUserBookedTrips = uid => this.db.ref(`bookedUserTrips/${uid}`);

    // @return Returns a reference to the query’s location
    userBookedTrips = () => this.db.ref('bookedUserTrips');

    // Saved Trips API
    // @param  trip_id  The trip id of the user being requested
    // @return Returns a reference to the query’s location
    savedTrip = trip => this.db.ref(`savedTrips/${trip}`);

    // @return Returns a reference to the query’s location
    savedTrips = () => this.db.ref('savedTrips');

    // User Saved Trips API
    // @param  uid  The trip id of the user whose trips are being requested
    // @return Returns a reference to the query’s location
    singleUserSavedTrips = uid => this.db.ref(`savedUserTrips/${uid}`);

    // @return Returns a reference to the query’s location
    userSavedTrips = () => this.db.ref('savedUserTrips');
}
  
export default Firebase;