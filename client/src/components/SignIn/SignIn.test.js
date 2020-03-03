import React from 'react';
import { BrowserRouter, withRouter } from 'react-router-dom';

import { createMount } from '@material-ui/core/test-utils';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import SignIn from './'
import {SignInFormBase, styles} from './SignInFormBase'
import { withStyles } from '@material-ui/core/styles';

import Firebase from '../Firebase/firebase';

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

Enzyme.configure({ adapter: new Adapter() })

describe('testing form', () => {
  let mount;
  
  beforeAll(() => {
    mount = createMount({ });
  });

  it('check if fields receive text', () => {
    const wrapper = mount(<BrowserRouter> <SignIn /> </BrowserRouter>);

    expect(wrapper.find('input').at(0).prop('value')).toBe('');
    expect(wrapper.find('input').at(1).prop('value')).toBe('');

    wrapper.find('input').at(0).simulate('change', { target: { name: 'email', value: 'mickeymouse@disney.com' } });
    wrapper.find('input').at(1).simulate('change', { target: { name: 'password', value: '.waltdisneyrocks' } });

    expect(wrapper.find('input').at(0).prop('value')).toBe('mickeymouse@disney.com');
    expect(wrapper.find('input').at(1).prop('value')).toBe('.waltdisneyrocks');
  });
});

describe('testing button', () => {
  let mount;

  beforeAll(() => {
    mount = createMount({ });
  });

  it('check if button disables correctly', () => {
    const wrapper = mount(<BrowserRouter> <SignIn /> </BrowserRouter>);

    // Check if every iteration still has the form disabled
    expect(wrapper.find('button').at(0).prop('disabled')).toEqual(true);
    wrapper.find('input').at(0).simulate('change', { target: { name: 'email', value: 'mickeymouse@disney.com' } });
    expect(wrapper.find('button').at(0).prop('disabled')).toEqual(true);
    wrapper.find('input').at(1).simulate('change', { target: { name: 'password', value: '.waltdisneyrocks' } });
    
    // Check if valid input enables the button
    expect(wrapper.find('button').at(0).prop('disabled')).toEqual(false);
  });

  it('testing button click', () => {
    const SignInFormBaseStyled = withStyles(styles)(SignInFormBase);
    const wrapper = mount(<BrowserRouter> <SignInFormBaseStyled/> </BrowserRouter>);
    const buttonClick = jest.fn().mockImplementation((event) => { return "clicked" });
    wrapper.instance().onSubmit = buttonClick;
    wrapper.update();
    
    wrapper.find('input').at(0).simulate('change', { target: { name: 'email', value: 'mickeymouse@disney.com' } });
    wrapper.find('input').at(1).simulate('change', { target: { name: 'password', value: '.waltdisneyrocks' } });
    
    const buttonInstance = wrapper.find('button').at(0);
    
    buttonInstance.props().onClick = buttonClick;
    const eventMock = { preventDefault: jest.fn() };
    buttonInstance.props().onClick(eventMock);
    expect(buttonClick).toBeCalledWith(eventMock);
  });

});

describe('testing Firebase functionality', () => {
  let mount;
  const SignInFormBaseStyled = withRouter(withStyles(styles)(SignInFormBase));

  const FirebaseInstance = new Firebase();
  const signedIn = jest.fn();
  FirebaseInstance.auth.autoFlush();

  // Creating a listener for onAuth
  FirebaseInstance.auth.onAuth(function (authData) {
    if (authData !== null ) {
      signedIn(authData);
    }
  });

  const testEmail = 'mickeymouse@disney.com';
  const testPassword = '.waltdisneyrocks';

  beforeAll(() => {
    mount = createMount({ });
    // Create dummy user
    FirebaseInstance.doCreateUserWithEmailAndPassword(testEmail, testPassword);
  });

  it('Testing if clicking button signs in user on Firebase Auth', () => {
    const wrapper = mount(<BrowserRouter> <SignInFormBaseStyled firebase={FirebaseInstance}/> </BrowserRouter>);

    wrapper.find('input').at(0).simulate('change', { target: { name: 'email', value: testEmail } });
    wrapper.find('input').at(1).simulate('change', { target: { name: 'password', value: testPassword } });
    
    const buttonInstance = wrapper.find('button').at(0);
    const eventMock = { preventDefault: jest.fn() };

    buttonInstance.props().onClick(eventMock);
    expect(signedIn).toBeCalledWith({ isAnonymous: false, email: 'mickeymouse@disney.com' });
    expect(signedIn).toBeCalledTimes(1);
  });

});
