import React, { Component } from 'react';
import CTAButton from '../CTAButton/CTAButton';
import * as ROUTES from '../../constants/routes';
import { Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';

import './TripBooked.css';

const styles = () => ({
  congratsPretext: {
    fontFamily: "Indie Flower",
    fontSize: 60
  },
  congratsPosttext: {
    fontFamily: "Indie Flower",
    fontSize: 40
  },
  destinationText: {
    fontSize: 40,
    color: "#FFDD64"
  },
  ticketTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#959595"
  },
  ticketNameField: {
    fontSize: 18,
    color: "#959595",
    marginRight: 22
  },
  ticketNameValue: {
    flex: "1 1 auto",
    backgroundColor: "#FFEEB1",
    fontFamily: "Indie Flower",
    fontSize: 22,
    padding: "2px 10px"
  },
  ticketField: {
    fontSize: 18,
    color: "#959595",
    width: "25%"
  },
  ticketValue: {
    fontFamily: "Indie Flower",
    fontSize: 22,
    width: "25%"
  },
  shareTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#7A7A7A"
  },
  orTitle: {
    fontSize: 24,
    color: "#7A7A7A"
  }
});

class TripBooked extends Component {
  
  viewItinerary = e => {
    e.preventDefault();
    this.props.history.push(ROUTES.MY_TRIPS);
  }    

  render() {
    const { classes, name, destination, date, time } = this.props;

    return (<div id="trip-booked-container">
      <div id="trip-booked-content-container">
        <div id="congrats-title-container">
          <span className={classes.congratsPretext}>Congrats! </span>
          <span className={classes.congratsPosttext}>You're going to...</span>
        </div>
        <div id="trip-booked-ticket-container">
          <div id="destination-container">
            <div id="destination-text-container">
              <Typography className={classes.destinationText}><b>{destination}</b></Typography>
            </div>
          </div>
          <div id="ticket-divider"></div>
          <div id="ticket-info-container">
            <Typography className={classes.ticketTitle}>BOARDING PASS</Typography>
            <div id="ticket-name-field-container">
              <Typography className={classes.ticketNameField}>Name:</Typography>
              <Typography className={classes.ticketNameValue}>{name}</Typography>
            </div>
            <div id="ticket-logistics-container">
              <div id="ticket-logistics-fields-container">
                <Typography className={classes.ticketField}>Date</Typography>
                <Typography className={classes.ticketField}>Time</Typography>
                <Typography className={classes.ticketField}>Gate</Typography>
                <Typography className={classes.ticketField}>Seat</Typography>
              </div>
              <div id="ticket-logistics-values-container">
                <Typography className={classes.ticketValue}>{date}</Typography>
                <Typography className={classes.ticketValue}>{time}</Typography>
                <Typography className={classes.ticketValue}>TBD</Typography>
                <Typography className={classes.ticketValue}>17A</Typography>
              </div>
            </div>
          </div>
        </div>
        <div id="trip-booked-actions-container">
          <Typography className={classes.shareTitle}>SHARE</Typography>
          <Typography className={classes.orTitle}>OR</Typography>
          <CTAButton boxShadow={3} onClick={this.viewItinerary}>VIEW ITINERARY</CTAButton>
        </div>
      </div>
    </div>);
  }
}

export default withRouter(withStyles(styles)(TripBooked));