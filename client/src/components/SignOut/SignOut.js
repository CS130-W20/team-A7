import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import { Button } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';

/** @class SignOutButton renders the sign out button. */
class SignOutButton extends Component {
  /**
  * Creates onClick functionality for button
  * 
  * @param none
  * @return none
  */
  onClick = () => {
    this.props.firebase.doSignOut();
    this.props.history.push(ROUTES.LANDING);
  }
  
  /**
  * Renders the component
  *
  * @param none
  * @return HTML {HTML} The HTML representation of the rendered component
  */
  render() {
    return (
      <Button style={{color: "white"}} onClick={this.onClick}>
        Sign Out
      </Button>
    );
  }
}

export default withRouter(withFirebase(SignOutButton));