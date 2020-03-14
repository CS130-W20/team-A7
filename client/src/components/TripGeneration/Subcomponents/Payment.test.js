import { createMount, createShallow } from '@material-ui/core/test-utils';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { BrowserRouter, withRouter } from 'react-router-dom';
import { AuthUserContext } from '../../Session';
import { Payment, styles } from './Payment';
import { withStyles } from '@material-ui/core/styles';

import Firebase from '../../Firebase/firebase';

Enzyme.configure({ adapter: new Adapter() })

// Now mock 'firebase/app`:
jest.mock('firebase/app', () => {
  const firebasemock = require('firebase-mock');
  const mockauth = new firebasemock.MockAuthentication();
  const mockdatabase = new firebasemock.MockFirebase();
  const mocksdk = new firebasemock.MockFirebaseSdk(
    (path) => {
      return path ? mockdatabase.child(path) : mockdatabase;
    },
    () => mockauth, 
    null,
  );
  return mocksdk; 
});

describe('testing payment form', () => {
  let mount;
  
  beforeAll(() => {
    mount = createMount({ });
  });

  it('checking that fields receive text and format correctly', () => {
    const PaymentStyled = withStyles(styles)(Payment);
    const wrapper = mount(<PaymentStyled/>);
    
    wrapper.find(Payment).first().instance().setAuthUser = jest.fn().mockImplementation(() => { });

    expect(wrapper.find('input').at(0).prop('value')).toBe('');
    expect(wrapper.find('input').at(1).prop('value')).toBe('');
    expect(wrapper.find('input').at(2).prop('value')).toBe('');
    expect(wrapper.find('input').at(3).prop('value')).toBe('');

    wrapper.find('input').at(0).simulate('change', { target: { name: 'cardName', value: 'Kyle Romero' } });
    wrapper.find('input').at(1).simulate('change', { target: { name: 'cardNumber', value: '4561441635108144' } });
    wrapper.find('input').at(2).simulate('change', { target: { name: 'expDate', value: '1225' } });
    wrapper.find('input').at(3).simulate('change', { target: { name: 'cvv', value: '219' } });

    expect(wrapper.find('input').at(0).prop('value')).toBe('Kyle Romero');
    // Checking if formatCreditCardNumber added spaces
    expect(wrapper.find('input').at(1).prop('value')).toBe('4561 4416 3510 8144');
    // Checking if formatExpirationDate added /
    expect(wrapper.find('input').at(2).prop('value')).toBe('12/25');
    expect(wrapper.find('input').at(3).prop('value')).toBe('219');
  });

  it('checking that credit card is validated', () => {
    const PaymentStyled = withStyles(styles)(Payment);
    const wrapper = mount(<PaymentStyled/>);
    
    wrapper.find(Payment).first().instance().setAuthUser = jest.fn().mockImplementation(() => { });
    expect(wrapper.find(Payment).first().instance().isValidCardNumber('4561441635108144')).toBe(true);
    expect(wrapper.find(Payment).first().instance().isValidCardNumber('1234567891234567')).toBe(false);
  });

});

describe('testing firebase functionality', () => {
  let mount;
  const PaymentStyled = withStyles(styles)(Payment);

  const FirebaseInstance = new Firebase();
  const bookedUserTripsRef = FirebaseInstance.db.ref('/bookedUserTrips');
  const bookedTripsRef = FirebaseInstance.db.ref('/bookedTrips');
  const pushedUserTrips = jest.fn();
  const pushedBookedTrips = jest.fn();
  FirebaseInstance.auth.autoFlush();
  bookedUserTripsRef.autoFlush();
  bookedTripsRef.autoFlush();
  
  // Creating a listener for push
  bookedUserTripsRef.on('child_added', function (snapshot) {
    var newTripId = Object.values(snapshot.val())[0];
    pushedUserTrips(newTripId);
  });
  bookedTripsRef.on('child_added', function (snapshot) {
    pushedBookedTrips(snapshot.val());
  });
  
  beforeAll(() => {
    mount = createMount({ });
  });

  it('checking the functionality of writing to user booked trips', () => {
    const wrapper = mount(<PaymentStyled firebase={FirebaseInstance}/> );

    wrapper.find(Payment).first().instance().writeToUserBookedTrips('testUid', 'testTripId');

    expect(pushedUserTrips).toBeCalledWith('testTripId');
  });

  it('checking the functionality of writing to booked trips', () => {
    const wrapper = mount(<PaymentStyled firebase={FirebaseInstance}/> );

    wrapper.find(Payment).first().instance().writeToBookedTrips('testUid', { name: 'name' });

    expect(pushedBookedTrips).toBeCalledWith({ name: 'name' });
  });
});