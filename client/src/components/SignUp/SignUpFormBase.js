import React, { Component } from 'react';

import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'

import { SignInLink } from '../SignIn';
import * as ROUTES from '../../constants/routes';

const styles = (theme) => ({
  card: {
    marginTop: 50,
    maxWidth: 500,
    margin: "auto",
    transition: "0.3s",
    boxShadow: "0 8px 40px -12px rgba(0,0,0,0.3)",
    "&:hover": {
      boxShadow: "0 16px 70px -12.125px rgba(0,0,0,0.3)"
    }
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  error: {
    color: 'red',
    fontSize: 'small',
    margin: theme.spacing(3, 0, 2),
  }
});

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
    event.preventDefault();
    const { firstname, lastname, email, passwordOne } = this.state;
    this.props.firebase
    .doCreateUserWithEmailAndPassword(email, passwordOne)
    .then(authUser => {
      const uid = authUser.uid ? authUser.user === 'undefined' : authUser.user.uid;
      // Get user information
      return this.props.firebase
      .user(uid)
      .set({
        firstname,
        lastname,
        email,
      });
    })
    .then(authUser => {
      this.setState({ ...INITIAL_STATE });
      this.props.history.push(ROUTES.LANDING);
    })
    .catch(error => {
      console.log('Error: ', error.message);
      this.setState({ error });
    });
  };
  
  render() {
    const { classes } = this.props;
  
    const {
      firstname,
      lastname,
      email,
      passwordOne,
      passwordTwo,
      error,
    } = this.state;
  
    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      email === '' ||
      firstname === '' ||
      lastname === '';
  
    return (
      <div id="centered-fixed-masthead">
        <Card className={classes.card}>
          <CardContent>
            <Container component="main" maxWidth="xs">
              <CssBaseline />
              <div className={classes.paper}>
                <Typography component="h1" variant="h5">
                  Sign up
                </Typography>
                <form className={classes.form} noValidate>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        inputProps={{
                          'data-testid': 'firstnameInput'
                        }}
                        autoComplete="fname"
                        name="firstname"
                        value={firstname}
                        onChange={this.onChange}
                        variant="outlined"
                        required
                        fullWidth
                        id="firstname"
                        label="First Name"
                        autoFocus
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        inputProps={{
                          'data-testid': 'lastnameInput'
                        }}
                        variant="outlined"
                        required
                        fullWidth
                        id="lastname"
                        label="Last Name"
                        name="lastname"
                        value={lastname}
                        onChange={this.onChange}
                        autoComplete="lname"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        inputProps={{
                          'data-testid': 'emailInput'
                        }}
                        variant="outlined"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        value={email}
                        onChange={this.onChange}
                        autoComplete="email"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        inputProps={{
                          'data-testid': 'passwordOneInput'
                        }}
                        variant="outlined"
                        required
                        fullWidth
                        name="passwordOne"
                        label="Password"
                        type="password"
                        id="password"
                        value={passwordOne}
                        onChange={this.onChange}
                        autoComplete="current-password"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        inputProps={{
                          'data-testid': 'passwordTwoInput'
                        }}
                        variant="outlined"
                        required
                        fullWidth
                        name="passwordTwo"
                        label="Confirm Password"
                        type="password"
                        id="password"
                        value={passwordTwo}
                        onChange={this.onChange}
                        autoComplete="current-password"
                      />
                    </Grid>
                  </Grid>
                  <Button
                    data-testid='submit'
                    disabled={isInvalid}
                    onClick={this.onSubmit}
                    variant='primary'
                    type="submit"
                    fullWidth
                    color="primary"
                    className={classes.submit}
                  >
                    Sign Up
                  </Button>
                  
                  {error && <Typography className={classes.error}>{error.message}</Typography>}
  
                  <Grid container justify="flex-end">
                    <Grid item>
                      <SignInLink/>
                    </Grid>
                  </Grid>
                </form>
              </div>
            </Container>
          </CardContent>
        </Card>
      </div>
    );
  }
}

export { SignUpFormBase, styles };
export default SignUpFormBase;