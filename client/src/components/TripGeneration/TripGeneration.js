import React, { Component } from 'react';
import Price from './Subcomponents/Price';
import Quiz from './Subcomponents/Quiz';
import Payment from './Subcomponents/Payment';
import TripBooked from './Subcomponents/TripBooked';
import { AuthUserContext } from '../Session';

const INITIAL_STATE = {
  step: 1,
  // Criteria (set by Quiz)
  departureAirport: null,
  departureDate: null,
  returnDate: null,
  destination: "anyDest",
  price: "anyPrice",
  budget: 0,
  // Trip info (set by Price)
  totalPrice: null,
  bookTrip: null,
  saveTrip: null,
  hotel: null,
  apiErr: null,
  // Ticket name passes from payment
  ticketName: 'someone',
  //
  userFullName: null,
  gotContext: false,
};

/**
  * Formats a time string.
  *
  * @param date {Date} Date object
  * @return timeString {String} The String representation of the Date, formatted.
  */
const formatTime = (date) => {
  const hour = date.getHours();
  const minutes = date.getMinutes();

  let timeString;
  if (hour === 0) {
    timeString = '12:';
  } else {
    timeString = `${hour % 12}:`;
  }

  timeString += `${minutes}`.padStart(2, '0');
  return timeString + ` ${hour < 12 ? 'AM' : 'PM'}`;
}

/** @class TripGeneration manages children components, stores state data. */
export class TripGeneration extends Component {
  /**
  * Creates an instance of TripGeneration.
  *
  * @constructor
  * @param {props} The React Component properties.
  */
  constructor(props) {
    super(props);
    if (typeof this.props.location.state !== 'undefined') {
      this.state = {...this.props.location.state};
    }
    else {
      this.state = { ...INITIAL_STATE };
    }
  }

   /**
  * Sets the state of the object's rendered variables.
  *
  * @param none
  * @return none
  */
  componentDidUpdate() {
    console.log('got context');
    if (typeof this.context.user !== 'undefined' && this.context.user !== null && !this.state.gotContext) {
      console.log('got context');
      this.setState({
        gotContext: true,
        userFullName: this.context.user.firstname + ' ' + this.context.user.lastname,
      });
    }
  }
  
  /**
  * Proceeds to the next step
  *
  * @param none
  * @return none
  */
  nextStep = () => {
    const { step } = this.state;
    this.setState({
      step: step + 1
    });
  };
  
  /**
  * Reverses to the previous step
  *
  * @param none
  * @return none
  */
  prevStep = () => {
    const { step } = this.state;
    this.setState({
      step: step - 1
    });
  };

  /**
  * Button click goes back to Quiz page
  *
  * @param none
  * @return none
  */
  goBackToQuiz = () => {
    this.setState({
      step: 1
    });
  }
  
  /**
  * Handler for various events
  *
  * @param event {String} Event type
  * @param value {Object} Variable object, value associated with each event
  * @return none
  */
  handleChange = (event, value) => {
    if (event === 'autocomplete') {
      this.handleAutocomplete(value);
    }
    else if (event === 'departureDate') {
      this.handleDepartureDate(value);
    }
    else if (event === 'returnDate') {
      this.handleReturnDate(value);
    }
    else {
      this.handleButtonChange(event, value);
    }
  }

  /**
  * Handler for slider
  *
  * @param value {Int} Budget number associated with slider status
  * @return none
  */
  handleSliderChange = (value) => {
    this.setState({ budget: value });
  };

  /**
  * Handler for button
  *
  * @param event {Object} Event type
  * @param value {String} Value associated with event
  * @return none
  */
  handleButtonChange = (event, value) => {
    this.setState({ [event.target.name]: value });
  };
    
  /**
  * Handler for searchbar autocomplete
  *
  * @param airport {JSON} Key Value pair of airport with its airport code
  * @return none
  */
  handleAutocomplete = (airport) => {
    if (airport !== null){
      console.log("Listener (Autocomplete): " + airport.code);
      this.setState({
        departureAirport: airport
      });
    }
  }
  /**
  * Handler for calendar listener
  *
  * @param date {Date} Date chosen by user
  * @return none
  */
  handleDepartureDate = (date) => {
    console.log("Listener (DepartureDate): " + date);
    if (this.state.returnDate !== null &&  this.state.departureDate >= date) {
      window.alert("Please enter a departure date before your return date :)");
    }
    else {
      this.setState({
        departureDate: date
      });
    }
  };

  /**
  * Handler for calendar listener
  *
  * @param date {Date} Date chosen by user
  * @return none
  */
  handleReturnDate = (date) => {
    console.log("Listener (ReturnDate): " + date);
    if (this.state.departureDate !== null && date <= this.state.departureDate) {
      window.alert("Please enter a return date after your departure date :)");
    }
    else {
      this.setState({
        returnDate: date
      }); 
    }
  };
  
  /**
  * Sets the data associated with a trip.
  *
  * @param bookTrip {Trip} BookedTrip that will be booked
  * @param saveTrip {Trip} SavedTrip that will be saved
  * @param hotel {HotelStay} Hotel object
  * @param price {Int} Price of the trip
  * @return none
  */
  setTripData = (bookTrip, saveTrip, hotel, price) => {
    this.setState({
      bookTrip: bookTrip,
      saveTrip: saveTrip, 
      hotel: hotel,
      totalPrice: price,
  })};
  
  /**
  * sets state of Error
  *
  * @param err {String} Detailed error message
  * @return none
  */
  setApiErr = (err) => { 
    this.setState({
      apiErr : err,
  })};
  
  /**
  * sets state of totalPrice
  *
  * @param price {Int} price of trip
  * @return none
  */
  setTotalPrice = (price) => {
    this.setState({
      totalPrice : price,
  })};
  
  /**
  * sets state of ticketName
  *
  * @param name {String} Name on Ticket
  * @return none
  */
  setTicketName = (name) => {
    this.setState({
      ticketName : name,
  })};
  
  /**
  * Renders the component
  *
  * @param none
  * @return HTML {HTML} The HTML representation of the component.
  */
  render() {
    const { step } = this.state;
    const { departureAirport, departureDate, returnDate, destination, price, budget, totalPrice, bookTrip, saveTrip, hotel, apiErr, ticketName } =  this.state;
    const values = { departureAirport, departureDate, returnDate, destination, price, budget, totalPrice, bookTrip, saveTrip, hotel, apiErr, ticketName };
  
    switch (step) {
      case 1:
        return (
          <Quiz
            nextStep={this.nextStep}
            handleSliderChange={this.handleSliderChange}
            handleChange={this.handleChange}
            values={values}
          />
        );
      case 2:
        return (
          <Price
            nextStep={this.nextStep}
            prevStep={this.prevStep}
            goBack={this.goBackToQuiz}
            handleChange={this.handleChange}
            setTripData={this.setTripData}
            setTotalPrice={this.setTotalPrice}
            setApiErr={this.setApiErr}
            values={values}
          />
        );
      case 3:
        return (
          <Payment nextStep={this.nextStep} setTicketName={this.setTicketName} values={values}/>
        );
      case 4:
        console.log(this.state.bookTrip);
        const dateStr = this.state.bookTrip.departureFlight.departureDate;
        const date = new Date(dateStr);
        const yearString = `${date.getFullYear()}`.slice(-2);
        const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${yearString}`;
        const formattedTime = formatTime(date);

        return (
          <TripBooked 
            name={this.state.userFullName === null ? this.state.ticketName : this.state.userFullName}
            destination={this.state.bookTrip.departureFlight.destinationCity}
            date={formattedDate}
            time={formattedTime}
          />
        );
      default:
        return(
          <div> Error </div>
        )
    }
  }
}
  
TripGeneration.contextType = AuthUserContext;

export default TripGeneration;