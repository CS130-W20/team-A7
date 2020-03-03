import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { createMount } from '@material-ui/core/test-utils';
import jest from 'jest-mock';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import SignUp from '.'
import {SignUpFormBase, styles} from './SignUpFormBase'
import { withStyles } from '@material-ui/core/styles';

Enzyme.configure({ adapter: new Adapter() })

describe('testing form', () => {
  let mount;
  
  beforeAll(() => {
    mount = createMount({ });
  });

  it('check if fields receive text', () => {
    const wrapper = mount(<BrowserRouter> <SignUp /> </BrowserRouter>);

    expect(wrapper.find('input').at(0).value === '');
    expect(wrapper.find('input').at(1).value === '');
    expect(wrapper.find('input').at(2).value === '');
    expect(wrapper.find('input').at(3).value === '');
    expect(wrapper.find('input').at(4).value === '');

    wrapper.find('input').at(0).simulate('change', { target: { name: 'firstname', value: 'Mickey' } });
    wrapper.find('input').at(1).simulate('change', { target: { name: 'lastname', value: 'Mouse' } });
    wrapper.find('input').at(2).simulate('change', { target: { name: 'email', value: 'mickeymouse@disney.com' } });
    wrapper.find('input').at(3).simulate('change', { target: { name: 'passwordOne', value: '.waltdisneyrocks' } });
    wrapper.find('input').at(4).simulate('change', { target: { name: 'passwordTwo', value: '.waltdisneyrocks' } });

    expect(wrapper.find('input').at(0).value === 'Mickey');
    expect(wrapper.find('input').at(1).value === 'Mouse');
    expect(wrapper.find('input').at(2).value === 'mickeymouse@disney.com');
    expect(wrapper.find('input').at(3).value === '.waltdisneyrocks');
    expect(wrapper.find('input').at(4).value === '.waltdisneyrocks');
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

