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
    console.log('checking...');

    if (typeof this.context !== 'undefined' && this.context !== null & !this.state.gotContext) {
      console.log('got context');
      this.setState({ 
        gotContext: true,
      });
      if (typeof this.context.authUser !== 'undefined') {
        this.setState({ 
          authUser: this.context.authUser,
        });
      }
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
      console.log('have not gotten context');
      this.setContext();
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