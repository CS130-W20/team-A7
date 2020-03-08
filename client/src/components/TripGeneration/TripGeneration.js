  
import React, { Component } from 'react';
import GeneratedTrip from './GeneratedTrip';
import Price from './Price';
import Quiz from './Quiz';

const INITIAL_STATE = {
  step: 1,
  departureAirport: null,
  departureDate: null,
  returnDate: null,
  destination: "anyDest",
  price: "anyPrice",
  budget: 0,
  totalPrice: null,
  generatedTrip: null,
  hotel: null,
  apiErr: null
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
      else if (event === 'budget'){
        this.setState({[event.target.name]: value});
        console.log('clicked!: ', event.target.name);
        console.log('clicked!: ', value);
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
  
  setTripData = (trip, hotel, price) => {
    this.setState({
      generatedTrip: trip,
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
    const { departureAirport, departureDate, returnDate, destination, price, budget, totalPrice, generatedTrip, hotel, apiErr } =  this.state;
    const values = { departureAirport, departureDate, returnDate, destination, price, budget, totalPrice, generatedTrip, hotel, apiErr };
  
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
          <GeneratedTrip values={values} />
        );
    }
  }
}
  
export default UserForm;