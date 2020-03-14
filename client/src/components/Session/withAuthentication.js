import React from 'react';

import AuthUserContext from './context';
import { withFirebase } from '../Firebase';

const withAuthentication = Component => {
  /** @class WithAuthentication Handles user authentication. */
  class WithAuthentication extends React.Component {
    /**
    * Creates an instance of PasswordForget
    *
    * @constructor
    * @param props {props} The react Component properties.
    */
    constructor(props) {
      super(props);
      this.state = {
        authUser: null,
        user: null,
      };
    }
    
    authStateChanged =
      this.props.firebase.auth.onAuthStateChanged(authUser => 
        {
          if (authUser) {
            this.setState({ authUser });
            // const user = this.props.firebase.user(authUser.uid).val();
            // this.setState({ user });
            this.props.firebase.user(authUser.uid).on('value', snapshot => {
              const userObject = snapshot.val();
              if (userObject) {
                // convert messages list from snapshot
                this.setState({ user: userObject });
              } else {
                this.setState({ user: null });
              }
            });
          }
          else {
            this.setState({ authUser: null });
            this.setState({ user: null });
          }
        },
      );

    /**
    * Sets the state of the object's rendered variables.
    *
    * @param none
    * @return none
    */
    componentDidMount() {
      this.listener = this.authStateChanged;
      // document.addEventListener('authState', this.authStateChanged);
    }
    
    /**
    * Sets the state of the object's rendered variables.
    *
    * @param none
    * @return none
    */
    componentWillUnmount() {
      this.listener();
    }
    
    /**
    * Renders the component
    *
    * @param none
    * @return HTML {HTML} The HTML representation of the component.
    */
    render() {
      return (
        <AuthUserContext.Provider value={{
          authUser: this.state.authUser,
          user: this.state.user,
        }}>
          <Component {...this.props} authUser={this.state.authUser} />
        </AuthUserContext.Provider>
      );
    }
  }
  return withFirebase(WithAuthentication);
};

export default withAuthentication;