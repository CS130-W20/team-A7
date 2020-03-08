  
import React, { Component } from 'react';
import GeneratedTrip from './GeneratedTrip';
import Price from './Price';
import Quiz from './Quiz';

const INITIAL_STATE = {
  step: 1,
  departureAirport: null,
  departureDate: null,
  returnDate: null,
  //cheapest: false,
  //underBudget: false,
  //farthest: false,
  //withinUS: false,
  //international: false,
  destination: "anyDest",
  price: "anyPrice",
  budget: [0,50],

  
  
  outAirline: null,
  inAirline: null,
  arrivalAirport: null,
  hotel: null,
  totalPrice: null
};

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

  handleButtonChange = (event, value) => {
    this.setState({ [event.target.name]: value });
  };
    
  handleAutocomplete = (airport) => {
    console.log("Listener (Autocomplete): " + airport.code);
    this.setState({
      departureAirport: airport
    });
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
  
  setTripData = (oAirline, iAirline, dest, arrAirport, hotelInfo, price) => {
    this.setState({
      outAirline : oAirline,
      inAirline : iAirline,
      destination : dest,
      arrivalAirport : arrAirport,
      hotel : hotelInfo,
      totalPrice : price
    });
  };
  
  render() {
    const { step } = this.state;
    const { departureAirport, departureDate, returnDate, destination, price, budget, outAirline, inAirline, arrivalAirport, hotel, totalPrice } =  this.state;
    const values = { departureAirport, departureDate, returnDate, destination, price, budget, outAirline, inAirline, arrivalAirport, hotel, totalPrice };
  
    switch (step) {
      case 1:
        return (
          <Quiz
            nextStep={this.nextStep}
            handleChange={this.handleChange}
            values={values}
          />
        );
      case 2:
        return (
          <Price
            nextStep={this.nextStep}
            prevStep={this.prevStep}
            handleChange={this.handleChange}
            setTripData={this.setTripData}
            values={values}
          />
        );
      case 3:
        return (
          <GeneratedTrip values={values} />
        );
    }
  }
}
  
export default UserForm;