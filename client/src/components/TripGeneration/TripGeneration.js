import React, { Component } from 'react';
import Price from './Subcomponents/Price';
import Quiz from './Subcomponents/Quiz';
import Payment from './Subcomponents/Payment';
import TripBooked from '../TripBooked';

const INITIAL_STATE = {
  step: 1,
  departureAirport: null,
  departureDate: null,
  returnDate: null,
  destination: "anyDest",
  price: "anyPrice",
  budget: 0,
  totalPrice: null,
  bookTrip: null,
  saveTrip: null,
  hotel: null,
  apiErr: null
};

const formatTime = (date) => {
  const hour = date.getHours();
  const minutes = date.getMinutes();

  let timeString;
  if (hour == 0) {
    timeString = '12:';
  } else {
    timeString = `${hour % 12}:`;
  }

  timeString += `${minutes}`.padStart(2, '0');
  return timeString + ` ${hour < 12 ? 'AM' : 'PM'}`;
}

export class UserForm extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }
  
  // Proceed to next step
  nextStep = () => {
    const { step } = this.state;
    this.setState({
      step: step + 1
    });
  };
  
  // Go back to prev step
  prevStep = () => {
    const { step } = this.state;
    this.setState({
      step: step - 1
    });
  };

  // Go back to quiz page
  goBackToQuiz = () => {
    this.setState({
      step: 1
    });
  }
  
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

  handleSliderChange = (value) => {
    this.setState({ budget: value });
  };

  handleButtonChange = (event, value) => {
    this.setState({ [event.target.name]: value });
  };
    
  handleAutocomplete = (airport) => {
    if (airport !== null){
      console.log("Listener (Autocomplete): " + airport.code);
      this.setState({
        departureAirport: airport
      });
  }
  }

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
  
  setTripData = (bookTrip, saveTrip, hotel, price) => {
    this.setState({
      bookTrip: bookTrip,
      saveTrip: saveTrip, 
      hotel: hotel,
      totalPrice: price,
  })};
  
  setApiErr = (err) => { 
    this.setState({
      apiErr : err,
  })};
  
  setTotalPrice = (price) => {
    this.setState({
      totalPrice : price,
  })};
  
  render() {
    const { step } = this.state;
    const { departureAirport, departureDate, returnDate, destination, price, budget, totalPrice, bookTrip, saveTrip, hotel, apiErr } =  this.state;
    const values = { departureAirport, departureDate, returnDate, destination, price, budget, totalPrice, bookTrip, saveTrip, hotel, apiErr };
  
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
          <Payment nextStep={this.nextStep}/>
        );
      case 4:
        console.log(this.state.generatedTrip);
        const date = this.state.generatedTrip.departureFlight.departureDate;
        const yearString = `${date.getFullYear()}`.slice(-2);
        const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${yearString}`;
        const formattedTime = formatTime(date);

        return (
          <TripBooked 
            name="Kyle Romero"
            destination={this.state.generatedTrip.departureFlight.destinationCity}
            date={formattedDate}
            time={formattedTime}
          />
        );
    }
  }
}
  
export default UserForm;