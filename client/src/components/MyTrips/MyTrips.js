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

/** @class MyTrips handles the rendering of the My Trips page*/
class MyTrips extends Component {
  /**
  * Creates an instance of MyTrips.
  *
  * @constructor
  * @param props {props} React Component properties
  */
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  /**
  * Sets the Context of a logged in user
  *
  * @param none
  * @return none
  */
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

  /**
  * Sets the state of the object's rendered variables.
  *
  * @param none
  * @return none
  */
  componentDidMount() {
    this.setContext();
  }

  /**
  * Sets the state of the object's rendered variables.
  *
  * @param none
  * @return none
  */
  componentWillMount() {
    this.setContext();
  }

  /**
  * Sets the state of the object's rendered variables.
  *
  * @param none
  * @return none
  */
  componentDidUpdate() {
    this.setContext();
  }

  /**
  * Renders the component
  *
  * @param none
  * @return HTML {HTML} The HTML of the rendered component
  */
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