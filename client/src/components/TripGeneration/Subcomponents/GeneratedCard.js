import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CTAButton from '../../CTAButton/CTAButton';
import FlightRoute from './FlightRoute';
import * as ROUTES from '../../../constants/routes';

const ColoredLine = ({ color }) => (
  <hr
    style={{
      color: color,
      backgroundColor: color,
      height: 1
    }}
  />
);

const getTime = (date) => {
  return `${date.getHours()}`.padStart(2, '0') + ':' + `${date.getMinutes()}`.padStart(2,'0');
}

const styles = (theme) => ({
  card: {
    marginTop: 50,
    width: '70vw',
    minHeight: 250,
    margin: 'auto',
    transition: '0.3s',
    boxShadow: '0 8px 40px -12px rgba(0,0,0,0.3)',
    '&:hover': {
      boxShadow: '0 16px 70px -12.125px rgba(0,0,0,0.3)'
    }
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Indie Flower',
    fontSize: 48,
    color: 'black',
    textAlign: 'center',
    fontWeight: 'bold',
    margin: 20,
  },
  subtitle: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 20
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 40
  },
  flightRouteContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: 40
  },
  buttonsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingLeft: 30,
    paddingRight: 30
  },
  bottomContainer: {
    padding: 40
  },
  grandTotalContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'baseline',
    marginBottom: 20
  },
  grandTotal: {
    fontSize: 28,
    fontWeight: 'bold',
    marginRight: 6
  },
  price: {
    fontSize: 34,
    fontFamily: 'Arial',
    fontWeight: 'bold'
  }
});

class GeneratedCard extends Component {
  constructor(props) {
    super(props);
  }

  onClick = e => {
    e.preventDefault();
    // Writing to firebase
    const { values } = this.props;
    console.log("saved info: ", values.generatedTrip);
    console.log("saved info: ", values.hotel);

    this.props.nextStep();
  }

  writeToBookedTrips(userId, newTrip) {
    const tripsRef = this.props.firebase.bookedTrips();
    const newTripRef = tripsRef.push();
    newTripRef.set(newTrip, function(error) {
      if (error) {
        console.log('Error: Failed to write trip to user ', userId, ': ', error);
      }
    });
    return newTripRef.key;
  }

  writeToUserBookedTrips(userId, tripId) {
    const currentUserTripsRef = this.props.firebase.singleUserBookedTrips(userId);
    const newIndex = currentUserTripsRef.push();
    newIndex.set(tripId);
  }

  writeToSavedTrips(userId, newTrip) {
    const tripsRef = this.props.firebase.savedTrips();
    const newTripRef = tripsRef.push();
    newTripRef.set(newTrip, function(error) {
      if (error) {
        console.log('Error: Failed to write trip to user ', userId, ': ', error);
      }
    });
    return newTripRef.key;
  }

  writeToUserSavedTrips(userId, tripId) {
    const currentUserTripsRef = this.props.firebase.singleUserSavedTrips(userId);
    const newIndex = currentUserTripsRef.push();
    newIndex.set(tripId);
  }

  saveTrip = e => {
    e.preventDefault();
    const { values, authUser } = this.props;
    if (authUser !== null) {
      if (typeof authUser.uid !== 'undefined' && authUser.uid !== null) {
        const userId = authUser.uid;
        // Writing to firebase
        const newTripKey = this.writeToSavedTrips(userId, values.saveTrip);
        if (typeof newTripKey !== 'undefined') {
          this.writeToUserSavedTrips(userId, newTripKey);
        }
        else {
          console.log('Error: ', 'Did not write to user trips, new trip key was undefined');
        }
      }
    }
    this.props.history.push(ROUTES.MY_TRIPS);
  }
  
  bookTrip = e => {
    e.preventDefault();
    const { values, authUser } = this.props;
    if (authUser !== null) {
      if (typeof authUser.uid !== 'undefined' && authUser.uid !== null) {
        const userId = authUser.uid;
        // Writing to firebase
        const newTripKey = this.writeToBookedTrips(userId, values.bookTrip);
        if (typeof newTripKey !== 'undefined') {
          this.writeToUserBookedTrips(userId, newTripKey);
        }
        else {
          console.log('Error: ', 'Did not write to user trips, new trip key was undefined');
        }
      }
    }
    this.props.nextStep();
  }

  onClickRetakeQuiz = e => {
    e.preventDefault();
    this.props.goBack();
  }

  render() {
    const { classes, values } = this.props;

    return (
      <div id="centered-fixed-masthead">
        <Card className={classes.card}>
          <div className={classes.paper}>
            <Typography className={classes.title}>
              Almost there!
            </Typography>
            <Typography className={classes.subtitle}>
              You're a few clicks away from your next adventure.
            </Typography>
          </div>
          <ColoredLine />
          <Typography className={classes.heading}>Your Trip</Typography>
          <div className={classes.flightRouteContainer}>
            <FlightRoute
              departureAirport={values.departureAirport.code}
              departureTime={getTime(values.departureDate)}
              departureDate={values.departureDate.toDateString()}
              destinationAirport="???"
              destinationTime="??:??"
              destinationDate="..."
            />
          </div>
          <div className={classes.flightRouteContainer}>
            <FlightRoute
              departureAirport="???"
              departureTime="??:??"
              departureDate="..."
              destinationAirport={values.departureAirport.code}
              destinationTime={getTime(values.returnDate)}
              destinationDate={values.returnDate.toDateString()}
            />
          </div>
          <div className={classes.bottomContainer}>
            <div className={classes.grandTotalContainer}>
              <Typography className={classes.grandTotal}>Grand Total: </Typography>
              <Typography className={classes.price}>${values.totalPrice}</Typography>
            </div>
            <div className={classes.buttonsContainer}>
              <Button label="retakeQuiz"
              type="submit"
              onClick={this.onClickRetakeQuiz}
              variant="contained">
                Retake Quiz
              </Button>
              <Button label="saveTrip"
              type="submit"
              onClick={this.saveTrip}
              variant="contained">
                Save Trip
              </Button>
              <CTAButton onClick={this.bookTrip}>BOOK NOW</CTAButton>
            </div>
          </div>
        </Card>
      </div>
    );
  }
}

export default withStyles(styles)(GeneratedCard);