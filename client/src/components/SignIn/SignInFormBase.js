import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { SignUpLink } from '../SignUp';
import * as ROUTES from '../../constants/routes';

import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card'

const styles = (theme) => ({
  card: {
    paddingBottom: 30,
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
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 3),
  },
  error: {
    color: 'red',
    fontSize: 'small',
    margin: theme.spacing(0, 0, 2),
  }
});

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
    const { classes } = this.props;
    const { email, password, error } = this.state;
    const isInvalid = password === '' || email === '';
    return (
      <div id="centered-fixed-masthead">
      <Card className={classes.card}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form className={classes.form} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              value={email}
              onChange={this.onChange}
              autoComplete="email"
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              value={password}
              onChange={this.onChange}
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              disabled={isInvalid}
              onClick={this.onSubmit}
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign In
            </Button>
  
            {error && <Typography className={classes.error}>{error.message}</Typography>}
  
            <Grid container>
              <Grid item xs>
                <Link to={ROUTES.PASSWORD_FORGET} variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <SignUpLink/>
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
      </Card>
      </div>
    );
  }
}

export { SignInFormBase, styles };
export default SignInFormBase;