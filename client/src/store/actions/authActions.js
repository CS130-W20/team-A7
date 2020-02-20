export const signIn = (creds) => {
    return (dispatch, getState, {getFirebase}) => {
      const firebase = getFirebase();
      
      firebase.auth().signInWithEmailAndPassword(
        creds.email,
        creds.password
      ).then(() => {
        dispatch({ type: 'SIGN_IN_SUCCESS' });
      }).catch((err) => {
        dispatch({ type: 'SIGN_IN_ERROR', err });
      });
    }
  }
  
  export const signOut = () => {
    return (dispatch, getState, {getFirebase}) => {
      const firebase = getFirebase();
  
      firebase.auth().signOut().then(() => {
        dispatch({ type: 'SIGN_OUT_SUCCESS' })
      }, function (err) {
        dispatch({ type: 'SIGN_OUT_ERROR', err})
      });
    }
  }
  
  export const signUp = (newCreds) => {
    return (dispatch, getState, {getFirebase, getFirestore}) => {
      const firebase = getFirebase();
      const firestore = getFirestore();
  
      firebase.auth().createUserWithEmailAndPassword(
        newCreds.email, 
        newCreds.passwordOne
      ).then(resp => {
        return firestore.collection('users').doc(resp.user.uid).set({
          firstName: newCreds.firstName,
          lastName: newCreds.lastName,
          email: newUser.email
        });
      }).then(() => {
        dispatch({ type: 'SIGN_UP_SUCCESS' });
      }).catch((err) => {
        dispatch({ type: 'SIGN_UP_ERROR', err});
      });
    }
  }
  
  export const resetPassword = (email) => {
    return (dispatch, getState, {getFirebase}) => {
      const firebase = getFirebase();
  
      firebase.auth().sendPasswordResetEmail(
        email
      ).then(() => {
        dispatch({ type: 'RESET_PASSWORD_SUCCESS' });
      }).catch((err) => {
        dispatch({ type: 'RESET_PASSWORD_ERROR', err});
      });
    }
  }
  
  export const changePassword = (newPass) => {
    return (dispatch, getState, {getFirebase}) => {
      const firebase = getFirebase();
  
      firebase.auth().currentUser.updatePassword(
        newPass
      ).then(() => {
        dispatch({ type: 'CHANGE_PASSWORD_SUCCESS' });
      }).catch((err) => {
        dispatch({ type: 'CHANGE_PASSWORD_ERROR', err});
      });
    }
  }