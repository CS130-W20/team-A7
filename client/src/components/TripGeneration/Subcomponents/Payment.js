import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Card from '@material-ui/core/Card';
import Checkbox from '@material-ui/core/Checkbox';
import CTAButton from '../../CTAButton/CTAButton';
import { Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { withFirebase } from '../../Firebase';
import { AuthUserContext } from '../../Session';
import { compose } from 'recompose';

var cardValidator = require('card-validator');

const styles = (theme) => ({
  card: {
    marginTop: 50,
    width: "60vw",
    minHeight: 250,
    margin: "auto",
    padding: 30,
    transition: "0.3s",
    boxShadow: "0 8px 40px -12px rgba(0,0,0,0.3)",
    "&:hover": {
      boxShadow: "0 16px 70px -12.125px rgba(0,0,0,0.3)"
    }
  },
  buttonContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50
  },
  error: {
    color: 'red',
    fontSize: 'small',
    margin: theme.spacing(3, 0, 2),
  }
});

const INITIAL_STATE = {
  cardName: '',
  cardNumber: '',
  expDate: '',
  cvv: '',
  cardIssuer: '',
  gotContext: false,
  authUser: null,
  error: null,
};

class Payment extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  componentDidUpdate() {
    if (typeof this.context.authUser !== 'undefined' && this.context.authUser !== null && !this.state.gotContext) {
      this.setState({
        gotContext: true,
        authUser: this.context.authUser,
      });
      // console.log('yeet: ', this.context);
    }
  }

  isValidCardNumber(cardNumber) {
    const numberValidation = cardValidator.number(cardNumber);
    if (!numberValidation.isValid) {
      this.setState({
        cardIssuer: '',
        error: new Error('Please enter a valid credit card number'),
      })
    }
    else {
      // Reset the error message
      console.log(numberValidation.card.type);
      this.setState({
        cardIssuer: numberValidation.card.type,
        error: null,
      })
    }
    return numberValidation.isPotentiallyValid;
  }

  clearNumber(value = "") {
    return value.replace(/\D+/g, "");
  }

  formatCreditCardNumber(value) {
    if (!value) {
      return value;
    }

    const clearValue = this.clearNumber(value);
    let nextValue;

    switch (this.state.cardIssuer) {
      case 'american-express':
        nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(
          4,
          10,
        )} ${clearValue.slice(10, 15)}`;
        break;
      default:
        nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(
          4,
          8,
        )} ${clearValue.slice(8, 12)} ${clearValue.slice(12, 19)}`;
        break;
    }
  
    return nextValue.trim();
  }

  formatCVV(value) {
    const clearValue = this.clearNumber(value);
    const maxLength = ((this.state.cardIssuer === 'american-express') ? 4 : 3);
    return clearValue.slice(0, maxLength);
  }

  formatExpirationDate(value) {
    const clearValue = this.clearNumber(value);
    if (clearValue.length >= 3) {
      return `${clearValue.slice(0, 2)}/${clearValue.slice(2, 4)}`;
    }
    return clearValue;
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
  
  onSubmit = e => {
    e.preventDefault();
    const { values, nextStep } = this.props;
    const { authUser } = this.state;

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
    
    nextStep();
  }

  onChange = event => {
    var value = event.target.value;
    if (event.target.name === 'cardNumber') {
      this.isValidCardNumber(value);
      value = this.formatCreditCardNumber(value);
    }
    else if (event.target.name === 'expDate') {
      value = this.formatExpirationDate(value);
    }
    else if (event.target.name === 'cvv') {
      value = this.formatCVV(value);
    }
    this.setState({ [event.target.name]: value });
  };
  
  render() {
    const { classes } = this.props;
  
    const {
      cardName,
      cardNumber,
      cardIssuer,
      expDate,
      cvv,
      error,
    } = this.state;

    const isInvalid =
      cardName === '' ||
      cardNumber === '' ||
      expDate === '' ||
      cvv === '' ||
      error !== null;
    
    return(
      <div id="centered-fixed-masthead">
        <Card className={classes.card}>
          <Typography variant="h6" gutterBottom>
            Payment method
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                name="cardName"
                value={cardName}
                onChange={this.onChange}
                id="cardName"
                label="Name on card"
                fullWidth />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="cardNumber"
                value={cardNumber}
                onChange={this.onChange}
                error={cardNumber !== '' && cardIssuer === ''}
                id="cardNumber"
                label="Card number"
                fullWidth />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="expDate"
                value={expDate}
                onChange={this.onChange}
                error={expDate.length > 0 && expDate.length < 4}
                pattern="\d\d/\d\d"
                id="expDate"
                label="Expiry date"
                fullWidth />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="cvv"
                value={cvv}
                onChange={this.onChange}
                error={cvv.length > 0 && cvv.length < 3}
                pattern="\d{3,4}"
                id="cvv"
                label="CVV"
                helperText={"Last " + (cardIssuer === 'american-express' ? "4" : "3") + " digits on signature strip"}
                fullWidth />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox color="secondary" name="saveCard" value="yes" />}
                label="Remember credit card details for next time"
              />
            </Grid>
          </Grid>
          <div className={classes.buttonContainer}>
            <Button disabled={isInvalid} onClick={this.onSubmit}> SUBMIT </Button>
          </div>

          {error && <Typography className={classes.error}>{error.message}</Typography>}
        </Card>
      </div>
    );
  }
}

Payment.contextType = AuthUserContext;

const PaymentComposed = compose(
  withFirebase,
  withStyles(styles),
)(Payment);

export default PaymentComposed;

// export default withStyles(styles)(function Payment(props) {
//   const { nextStep, classes } = props;

//   return (
//     <div id="centered-fixed-masthead">
//       <Card className={classes.card}>
//         <Typography variant="h6" gutterBottom>
//           Payment method
//         </Typography>
//         <Grid container spacing={3}>
//           <Grid item xs={12} md={6}>
//             <TextField required id="cardName" label="Name on card" fullWidth />
//           </Grid>
//           <Grid item xs={12} md={6}>
//             <TextField required id="cardNumber" label="Card number" fullWidth />
//           </Grid>
//           <Grid item xs={12} md={6}>
//             <TextField required id="expDate" label="Expiry date" fullWidth />
//           </Grid>
//           <Grid item xs={12} md={6}>
//             <TextField
//               required
//               id="cvv"
//               label="CVV"
//               helperText="Last three digits on signature strip"
//               fullWidth
//             />
//           </Grid>
//           <Grid item xs={12}>
//             <FormControlLabel
//               control={<Checkbox color="secondary" name="saveCard" value="yes" />}
//               label="Remember credit card details for next time"
//             />
//           </Grid>
//         </Grid>
//         <div className={classes.buttonContainer}>
//           <CTAButton onClick={nextStep}>SUBMIT</CTAButton>
//         </div>
//       </Card>
//     </div>
//   );
// });