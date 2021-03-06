import React from 'react';
import { BrowserRouter, withRouter } from 'react-router-dom';

import { createMount } from '@material-ui/core/test-utils';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import SignUp from '.'
import {SignUpFormBase, styles} from './SignUpFormBase'
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
    const wrapper = mount(<BrowserRouter> <SignUp /> </BrowserRouter>);

    expect(wrapper.find('input').at(0).prop('value')).toBe('');
    expect(wrapper.find('input').at(1).prop('value')).toBe('');
    expect(wrapper.find('input').at(2).prop('value')).toBe('');
    expect(wrapper.find('input').at(3).prop('value')).toBe('');
    expect(wrapper.find('input').at(4).prop('value')).toBe('');

    wrapper.find('input').at(0).simulate('change', { target: { name: 'firstname', value: 'Mickey' } });
    wrapper.find('input').at(1).simulate('change', { target: { name: 'lastname', value: 'Mouse' } });
    wrapper.find('input').at(2).simulate('change', { target: { name: 'email', value: 'mickeymouse@disney.com' } });
    wrapper.find('input').at(3).simulate('change', { target: { name: 'passwordOne', value: '.waltdisneyrocks' } });
    wrapper.find('input').at(4).simulate('change', { target: { name: 'passwordTwo', value: '.waltdisneyrocks' } });

    expect(wrapper.find('input').at(0).prop('value')).toBe('Mickey');
    expect(wrapper.find('input').at(1).prop('value')).toBe('Mouse');
    expect(wrapper.find('input').at(2).prop('value')).toBe('mickeymouse@disney.com');
    expect(wrapper.find('input').at(3).prop('value')).toBe('.waltdisneyrocks');
    expect(wrapper.find('input').at(4).prop('value')).toBe('.waltdisneyrocks');
  });
});

describe('testing button', () => {
  let mount;

  beforeAll(() => {
    mount = createMount({ });
  });

  it('check if button disables correctly', () => {
    const wrapper = mount(<BrowserRouter> <SignUp /> </BrowserRouter>);

    // Check if every iteration still has the form disabled
    expect(wrapper.find('button').at(0).prop('disabled')).toEqual(true);
    wrapper.find('input').at(0).simulate('change', { target: { name: 'firstname', value: 'Mickey' } });
    expect(wrapper.find('button').at(0).prop('disabled')).toEqual(true);
    wrapper.find('input').at(1).simulate('change', { target: { name: 'lastname', value: 'Mouse' } });
    expect(wrapper.find('button').at(0).prop('disabled')).toEqual(true);
    wrapper.find('input').at(2).simulate('change', { target: { name: 'email', value: 'mickeymouse@disney.com' } });
    expect(wrapper.find('button').at(0).prop('disabled')).toEqual(true);
    wrapper.find('input').at(3).simulate('change', { target: { name: 'passwordOne', value: '.waltdisneyrocks' } });
    expect(wrapper.find('button').at(0).prop('disabled')).toEqual(true);
    wrapper.find('input').at(4).simulate('change', { target: { name: 'passwordTwo', value: '.waltdisneyrocks' } });
    
    // Check if valid input enables the button
    expect(wrapper.find('button').at(0).prop('disabled')).toEqual(false);

    // Check if mismatched passwords disables the button
    wrapper.find('input').at(4).simulate('change', { target: { name: 'passwordTwo', value: '.waltdisneyrocls' } });
    expect(wrapper.find('button').at(0).prop('disabled')).toEqual(true);
  });

  it('testing button click', () => {
    const SignUpFormBaseStyled = withStyles(styles)(SignUpFormBase);
    const wrapper = mount(<BrowserRouter> <SignUpFormBaseStyled/> </BrowserRouter>);
    const buttonClick = jest.fn().mockImplementation((event) => { return "clicked" });
    wrapper.instance().onSubmit = buttonClick;
    wrapper.update();
    
    wrapper.find('input').at(0).simulate('change', { target: { name: 'firstname', value: 'Mickey' } });
    wrapper.find('input').at(1).simulate('change', { target: { name: 'lastname', value: 'Mouse' } });
    wrapper.find('input').at(2).simulate('change', { target: { name: 'email', value: 'mickeymouse@disney.com' } });
    wrapper.find('input').at(3).simulate('change', { target: { name: 'passwordOne', value: '.waltdisneyrocks' } });
    wrapper.find('input').at(4).simulate('change', { target: { name: 'passwordTwo', value: '.waltdisneyrocks' } });
    
    const buttonInstance = wrapper.find('button').at(0);
    
    buttonInstance.props().onClick = buttonClick;
    const eventMock = { preventDefault: jest.fn() };
    buttonInstance.props().onClick(eventMock);
    expect(buttonClick).toBeCalledWith(eventMock);
  });

});

describe('testing Firebase functionality', () => {
  let mount;
  const SignUpFormBaseStyled = withRouter(withStyles(styles)(SignUpFormBase));

  const FirebaseInstance = new Firebase();
  const userRef = FirebaseInstance.db.ref('/users');
  const pushed = jest.fn();
  FirebaseInstance.auth.autoFlush();
  userRef.autoFlush();
  
  // Creating a listener for push
  userRef.on('child_added', function (snapshot) {
    pushed(snapshot.val());
  });

  beforeAll(() => {
    mount = createMount({ });
  });

  it('Testing if clicking button creates user on Firebase Auth', () => {

    const wrapper = mount(<BrowserRouter> <SignUpFormBaseStyled firebase={FirebaseInstance}/> </BrowserRouter>);

    wrapper.find('input').at(0).simulate('change', { target: { name: 'firstname', value: 'Mickey' } });
    wrapper.find('input').at(1).simulate('change', { target: { name: 'lastname', value: 'Mouse' } });
    wrapper.find('input').at(2).simulate('change', { target: { name: 'email', value: 'mickeymouse@disney.com' } });
    wrapper.find('input').at(3).simulate('change', { target: { name: 'passwordOne', value: '.waltdisneyrocks' } });
    wrapper.find('input').at(4).simulate('change', { target: { name: 'passwordTwo', value: '.waltdisneyrocks' } });
    
    const buttonInstance = wrapper.find('button').at(0);
    const eventMock = { preventDefault: jest.fn() };
    buttonInstance.props().onClick(eventMock);
    
    return FirebaseInstance.auth.getUserByEmail('mickeymouse@disney.com').then(function(user) {
      expect(user.email).toBe('mickeymouse@disney.com');
      expect(user.password).toBe('.waltdisneyrocks');
    });
  });

  it('Testing if clicking button creates user on Firebase RTDB', () => {

    expect(pushed).toBeCalledWith({
      email: 'mickeymouse@disney.com',
      firstname: 'Mickey',
      lastname: 'Mouse'
    });
    expect(pushed).toBeCalledTimes(1);

  });

});
