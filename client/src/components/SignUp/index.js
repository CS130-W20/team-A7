import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

const SignUpPage = () => (
  <SignUpForm />
);

const INITIAL_STATE = {
  firstname: '',
  lastname: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  error: null,
};

class SignUpFormBase extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }
  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  
  onSubmit = event => {
    const { username, email, password } = this.state;
    this.props.firebase
      .doCreateUserWithEmailAndPassword(email, password)
      .then(authUser => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.LANDING);
      })
      .catch(error => {
        this.setState({ error });
      });
    event.preventDefault();
  };

  render() {
    const {
      firstname,
      lastname,
      email,
      passwordOne: passwordOne,
      passwordTwo: passwordTwo,
      error,
    } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      email === '' ||
      firstname === '' ||
      lastname === '';

    return (
      <div id="centered-masthead">
        <div className="row h-100 justify-content-center align-items-center">
          <Card style={{ width:'25rem' }}>
            <Card.Header as="h3" style={{ color: 'black', textAlign: 'left' }}>
              Sign Up
            </Card.Header>
            <Card.Body>
              <Form onSubmit={this.onSubmit}>
                <Form.Group controlId="formSignUpEmail">
                  <Form.Control name="email" value={email} onChange={this.onChange} type="email" placeholder="Email Address"/>
                </Form.Group>

                <Form.Row>
                  <Form.Group as={Col} controlId="formSignUpFirstName">
                    <Form.Control name="firstname" value={firstname} onChange={this.onChange} type="text" placeholder="First Name"/>
                  </Form.Group>

                  <Form.Group as={Col} controlId="formSignUpLastName">
                    <Form.Control name="lastname" value={lastname} onChange={this.onChange} type="text" placeholder="Last Name"/>
                  </Form.Group>
                </Form.Row>

                <Form.Group controlId="formSignUpPassOne">
                  <Form.Control name="passwordOne" value={passwordOne} onChange={this.onChange} type="password" placeholder="Password"/>
                </Form.Group>

                <Form.Group controlId="formSignUpPassTwo">
                  <Form.Control name="passwordTwo" value={passwordTwo} onChange={this.onChange} type="password" placeholder="Confirm Password"/>
                </Form.Group>

                {error && <Card.Text style={{ color: 'red', fontSize:'small'}}>{error.message}</Card.Text>}
                <Button disabled={isInvalid} type="submit" variant='primary' block>Sign Up</Button>
              </Form>
            </Card.Body>
          </Card>
        </div>
      </div>
    );  
  }
}

const SignUpLink = () => (
<p>
    Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
  </p>
);

const SignUpForm = compose(
  withRouter,
  withFirebase,
)(SignUpFormBase);

export default SignUpPage;
export { SignUpForm, SignUpLink };