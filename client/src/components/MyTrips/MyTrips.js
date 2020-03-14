import React, { Component } from 'react';
import { AuthUserContext } from '../Session';

import TripTabs from './TripTabs';
import { Redirect } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';

const INITIAL_STATE = {
  trips: [],
  error: null,
  gotContext: false,
  authUser: null,
};

class MyTrips extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  setContext() {
    if (typeof this.context.authUser !== 'undefined' && this.context.authUser !== null && !this.state.gotContext) {
      this.setState({ 
        gotContext: true,
        authUser: this.context.authUser,
      });
    }
  }

  componentDidMount() {
    this.setContext();
  }

  componentWillMount() {
    this.setContext();
  }

  componentDidUpdate() {
    this.setContext();
  }

  render() {
    if (!this.state.gotContext) {
      return (
        <div> </div>
      )
    }
    else if (this.state.gotContext && this.state.authUser === null) {
      return (
        <Redirect to = {ROUTES.LANDING}/>
      )
    }
    else {
      return(
        <div id="centered-flex-masthead">
          <TripTabs/>
        </div>
      );
    }
  }
}

MyTrips.contextType = AuthUserContext;

export default MyTrips;