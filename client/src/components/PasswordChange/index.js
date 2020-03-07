import React, { Component } from 'react';

import { Redirect } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import * as ROUTES from '../../constants/routes';

class PasswordChange extends Component {
  state = {
    email: ''
  }

  constructor(props) {
    super(props);
  }

  onSubmit = event => {
    event.preventDefault()
    this.props.resetPassword(this.state.email)
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value })
  };

  render() {
    const { email } = this.state
    const { error } = this.props

    const isInvalid = email === '';
    if (error === 'success') return <Redirect to={ROUTES.SIGN_IN}> </Redirect>

    return (
      <div id="centered-fixed-masthead">
        <div className="row h-100 justify-content-center align-items-center">
          <Card style={{ width:'25rem' }}>
            <Card.Header as="h3" style={{ color: 'black', textAlign: 'left'}}>
              Password Reset
            </Card.Header>
            <Card.Body>
              <Form onSubmit={this.onSubmit}>
                <Form.Group controlId="formResetPassword">
                  <Form.Control name="email" value={email} onChange={this.onChange} type="email" placeholder="Email"/>
                </Form.Group>
                {error && <Card.Text style={{ color: 'red', fontSize:'small'}}>{error.message}</Card.Text>}
                <Button disabled={isInvalid} type="submit" variant='primary' block>Reset</Button>
              </Form> 
            </Card.Body>
          </Card>
        </div>
      </div>
    );
  }
}

export default PasswordChange;