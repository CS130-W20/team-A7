import React, { Component } from 'react';
import GeneratingCard from './GeneratingCard';
import GeneratedCard from './GeneratedCard';
import { compose } from 'recompose';
import { withFirebase } from '../../Firebase';
import { AuthUserContext } from '../../Session';
import generateTrip from './generateTrip';

import { withRouter } from 'react-router-dom';

const MAX_TRIES = 5;

class Price extends Component {
  constructor(props) {
    super(props);
    this.state = {
      trip: null,
      hotel : null,
      gotContext: null,
      authUser: null,
    }
  }
  
  continue = e => {
    e.preventDefault();
    this.props.nextStep();
  };
  
  componentDidMount() {
    const { values, setTripData, setApiErr } = this.props;

    const tripData = {
      values: {
        departureAirport: values.departureAirport,
        destination: values.destination,
        price: values.price,
        budget: values.budget,
        departDate: values.departureDate.toISOString().slice(0,10),
        returnDate: values.returnDate.toISOString().slice(0,10)
      }
    };

    const onSuccess = (responseData) => {
      const { bookTrip, saveTrip, hotelStay, price } = responseData;
      setTripData(bookTrip, saveTrip, hotelStay, price);
    }

    const onError = (error) => {
      setApiErr(error);
    }
    
    generateTrip(values, tripData, onSuccess, onError);
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

  render() {
    const { values, goBack, nextStep, setApiErr, setTotalPrice } = this.props;
    let componentToRender;
    if (values.apiErr === null) {
      componentToRender = values.totalPrice === null ? <GeneratingCard /> : <GeneratedCard authUser={this.state.authUser} history={this.props.history} firebase={this.props.firebase} values={values} goBack={goBack} nextStep={nextStep} setApiErr={setApiErr} setTotalPrice={setTotalPrice}/>;
    } else {
      componentToRender = values.apiErr;
    }
    
    return (
      <div>
        { componentToRender }
      </div>
    );
  }
}

Price.contextType = AuthUserContext;

const PriceComposed = compose(
  withFirebase,
  withRouter,
)(Price);

export default PriceComposed;
