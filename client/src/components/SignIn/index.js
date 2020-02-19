import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { SignUpLink } from '../SignUp';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';

const SignInPage = () => (
  <SignInForm />
);

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};

class SignInFormBase extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }
  onSubmit = event => {
    const { email, password } = this.state;
    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.ABOUT);
      })
      .catch(error => {
        this.setState({ error });
      });
    event.preventDefault();
  };
  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  render() {
    const { email, password, error } = this.state;
    const isInvalid = password === '' || email === '';
    return (
      <div id="centered-masthead">
				<div className="row h-100 justify-content-center align-items-center">
					<Card style={{ width:'20rem' }}>
            <Card.Header as="h3" style={{ color: 'black' }}>Sign In</Card.Header>
            <Card.Body>
              <Form onSubmit={this.onSubmit}>
                <Form.Group controlId="formSignInEmail">
                  <Form.Control name="email" value={email} onChange={this.onChange} type="email" placeholder="Email Address"/>
                </Form.Group>
                <Form.Group controlId="formSignInPassword">
                  <Form.Control name="password" value={password} onChange={this.onChange} type="password" placeholder="Password"/>
                </Form.Group>
                {error && <Card.Text style={{ color: 'red', fontSize:'small'}}>{error.message}</Card.Text>}
                <Button disabled={isInvalid} type="submit" variant='primary' block>Sign In</Button>
              </Form>
              <p><Link to={ROUTES.PASSWORD_FORGET}>Forgot Password?</Link></p>
              <p style={{color:"black"}}>Don&#8217;t have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link></p>
            </Card.Body>
					</Card>
				</div>
			</div>
    );
  }
}

const SignInForm = compose(
  withRouter,
  withFirebase,
)(SignInFormBase);

export default SignInPage;
export { SignInForm };