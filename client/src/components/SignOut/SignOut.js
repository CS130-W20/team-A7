import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import { Button } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';

class SignOutButton extends Component {
  onClick = () => {
    this.props.firebase.doSignOut();
    this.props.history.push(ROUTES.LANDING);
  }
  render() {
    return (
      <Button style={{color: "white"}} onClick={this.onClick}>
        Sign Out
      </Button>
    );
  }
}

export default withRouter(withFirebase(SignOutButton));