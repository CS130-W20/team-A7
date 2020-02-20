import React, { Component } from 'react';
import { Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import CTAButton from '../CTAButton/CTAButton';
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
  constructor(props) {
    super(props);
  }

  render() {
    const { classes } = this.props;

    return (<div id="trip-booked-container">
      <div id="trip-booked-content-container">
        <div id="congrats-title-container">
          <span className={classes.congratsPretext}>Congrats! </span>
          <span className={classes.congratsPosttext}>You're going to...</span>
        </div>
        <div id="trip-booked-ticket-container">
          <div id="destination-container">
            <div id="destination-text-container">
              <Typography className={classes.destinationText}><b>Osaka,</b> Japan</Typography>
            </div>
          </div>
          <div id="ticket-divider"></div>
          <div id="ticket-info-container">
            <Typography className={classes.ticketTitle}>BOARDING PASS</Typography>
            <div id="ticket-name-field-container">
              <Typography className={classes.ticketNameField}>Name:</Typography>
              <Typography className={classes.ticketNameValue}>Kyle Romero</Typography>
            </div>
            <div id="ticket-logistics-container">
              <div id="ticket-logistics-fields-container">
                <Typography className={classes.ticketField}>Date</Typography>
                <Typography className={classes.ticketField}>Time</Typography>
                <Typography className={classes.ticketField}>Gate</Typography>
                <Typography className={classes.ticketField}>Seat</Typography>
              </div>
              <div id="ticket-logistics-values-container">
                <Typography className={classes.ticketValue}>3/19/20</Typography>
                <Typography className={classes.ticketValue}>9 AM</Typography>
                <Typography className={classes.ticketValue}>TBD</Typography>
                <Typography className={classes.ticketValue}>17A</Typography>
              </div>
            </div>
          </div>
        </div>
        <div id="trip-booked-actions-container">
          <Typography className={classes.shareTitle}>SHARE</Typography>
          <Typography className={classes.orTitle}>OR</Typography>
          <CTAButton boxShadow={3}>VIEW ITINERARY</CTAButton>
        </div>
      </div>
    </div>);
  }
}

export default withStyles(styles)(TripBooked);