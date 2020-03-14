import React, { Component } from 'react';

import { withStyles } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import ButtonBase from '@material-ui/core/ButtonBase';

import { withRouter } from 'react-router-dom';

const styles = theme => ({
  button: {
    textAlign: "left",
    margin: "auto",
    width: "100%",
  },
  root: {
    margin: "auto",
    width: "85%",
    height: 300,
    overflow: "initial",
    borderRadius: theme.spacing(2), // 16px
    boxShadow: "0px 14px 80px rgba(34, 35, 58, 0.2)",
    position: "relative",
    marginLeft: "auto",
    background: "#ffffff",
    display: "flex",
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2)
  },
  media: {
    height: 300,
    width: 300,
    marginLeft: theme.spacing(-2),
    marginRight: theme.spacing(1),
    borderRadius: theme.spacing(2),
    backgroundColor: "#fff",
    paddingRight: "10%"
  },
  tripInfo: {
    display: "flex",
    flexDirection: "column"
  },
  details: {
    marginLeft: theme.spacing(1),
  },
});

/** @class SavedTripCard representing a saved trip Card */
class SavedTripCard extends Component {
  
  /**
  * Gets the quiz parameter for a destination.
  *
  * @param destinationOpt {String} The option chosen by the user.
  * @return String {String} The quiz's representation of the object
  */
  destinationText(destinationOpt) {
    if (destinationOpt === 'anyDest') {
      return 'Surprise me!';
    }
    else if (destinationOpt === 'international') {
      return 'International';
    }
    else if (destinationOpt === 'withinUS') {
      return 'Within the U.S.';
    }
    else {
      return '';
    }
  }

  /**
  * Gets the quiz parameter for a price.
  *
  * @param priceOpt {String} The option chosen by the user.
  * @return String {String} The quiz's representation of the object
  */
  priceText(priceOpt) {
    if (priceOpt === 'anyPrice') {
      return "Cost isn't a factor";
    }
    else if (priceOpt === 'cheapest') {
      return 'Cheapest';
    }
    else if (priceOpt === 'underBudget') {
      return 'Under Budget';
    }
    else {
      return '';
    }
  }

  /**
  * Handles clicking on a SavedTripCard
  *
  * @param none
  * @return none
  */
  handleClickOpen = () => {
    this.props.history.push({
      pathname: '/quiz',
      state: { 
        step: 2,
        // Criteria (set by Quiz)
        departureAirport: this.props.trip.criteria.departureAirport,
        departureDate: new Date(this.props.trip.criteria.departureDate),
        returnDate: new Date(this.props.trip.criteria.returnDate),
        destination: this.props.trip.criteria.destination,
        price: this.props.trip.criteria.price,
        budget: this.props.trip.criteria.budget,
        // Trip info (set by Price)
        totalPrice: null,
        bookTrip: null,
        saveTrip: null,
        hotel: null,
        apiErr: null
      },
    })
  };

  /**
  * Renders the component
  *
  * @param none
  * @return HTML {HTML} The HTML representation of the component.
  */
  render() {
    const { classes } = this.props;
    return (
      <div>
      <ButtonBase className={classes.button} onClick={this.handleClickOpen}>
        <Card className={classes.root}>
          <div className={classes.tripInfo}>
            <CardContent>
              <Typography gutterBottom variant="h3">
                {"Latest Price: $" + this.props.trip.price.toFixed(2)}
              </Typography>
              <div className={classes.details}>
                <Typography variant="body1" gutterBottom>
                  Departing from: {this.props.trip.criteria.departureAirport.city}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  <i> {this.props.trip.criteria.departureDate} to {this.props.trip.criteria.returnDate} </i>
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  <i> {this.destinationText(this.props.trip.criteria.destination)} </i>
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  <i> {this.priceText(this.props.trip.criteria.price)} </i>
                </Typography>
              </div>
            </CardContent>
          </div>
        </Card>
      </ButtonBase>
      </div>
    );
  }
}

export default withRouter(withStyles(styles)(SavedTripCard));