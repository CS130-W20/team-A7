import SignUp from '.'
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Enzyme, { shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { shape } from 'prop-types';

// Instantiate router context
const router = {
  history: new BrowserRouter().history,
  route: {
    location: {},
    match: {},
  },
};

const createContext = () => ({
  context: { router },
  childContextTypes: { router: shape({}) },
});

// var firebasemock    = require('firebase-mock');

// var mockauth = new firebasemock.MockAuthentication();
// var mockdatabase = new firebasemock.MockFirebase();
// var mockfirestore = new firebasemock.MockFirestore();
// var mockstorage = new firebasemock.MockStorage();
// var mockmessaging = new firebasemock.MockMessaging();
// var mocksdk = new firebasemock.MockFirebaseSdk(
//   // use null if your code does not use RTDB
//   (path) => {
//     return path ? mockdatabase.child(path) : mockdatabase;
//   },
//   // use null if your code does not use AUTHENTICATION
//   () => {
//     return mockauth;
//   },
//   // use null if your code does not use FIRESTORE
//   () => {
//     return null;
//   },
//   // use null if your code does not use STORAGE
//   () => {
//     return null;
//   },
//   // use null if your code does not use MESSAGING
//   () => {
//     return null;
//   }
// );

// var jest = require('jest');

// jest.mock('../path-to-firebase-init', () => {
//     return mocksdk;
// });

Enzyme.configure({ adapter: new Adapter() })

it('check if fields receive text', () => {
    const { getByTestId } = render(<BrowserRouter><SignUp/></BrowserRouter>);
    
    const firstnameInput = getByTestId('firstnameInput');
    const lastnameInput = getByTestId('lastnameInput');
    const emailInput = getByTestId('emailInput');
    const passwordOneInput = getByTestId('passwordOneInput');
    const passwordTwoInput = getByTestId('passwordTwoInput');
    
    expect(firstnameInput).toHaveValue('');
    expect(lastnameInput).toHaveValue('');
    expect(emailInput).toHaveValue('');
    expect(passwordOneInput).toHaveValue('');
    expect(passwordTwoInput).toHaveValue('');
  
    fireEvent.change(firstnameInput, { target: { value: 'Mickey' } });
    fireEvent.change(lastnameInput, { target: { value: 'Mouse' } });
    fireEvent.change(emailInput, { target: { value: 'mickeymouse@disney.com' } });
    fireEvent.change(passwordOneInput, { target: { value: '.waltdisneyrocks' } });
    fireEvent.change(passwordTwoInput, { target: { value: '.waltdisneyrocks' } });

    expect(firstnameInput).toHaveValue('Mickey');
    expect(lastnameInput).toHaveValue('Mouse');
    expect(emailInput).toHaveValue('mickeymouse@disney.com');
    expect(passwordOneInput).toHaveValue('.waltdisneyrocks');
    expect(passwordTwoInput).toHaveValue('.waltdisneyrocks');
  });
  