import React from 'react';
import { Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import background from '../../assets/background.png';
import { Link } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import * as ROUTES from '../../constants/routes';

import Button from 'react-bootstrap/Button'
import './Landing.css';

const styles = () => ({
  smallTitle: {
    fontFamily: 'Indie Flower',
    fontSize: 42,
    color: 'white',
  },
  bigTitle: {
    fontFamily: 'Indie Flower',
    fontSize: 68,
    color: 'white',
    textAlign: 'right'
  },
  description: {
    width: '40%',
    fontSize: 20,
    color: 'white',
    textAlign: 'center'
  },
  alreadyHasAccount: {
    fontSize: 14,
    color: 'white'
  }
})

const Landing = ({ classes }) => (
  <div id="container">
    <div id="centered-masthead content-container">
      <div id="title-container">
        <Typography className={classes.smallTitle}>Life's already full of surprises...</Typography>
        <Typography className={classes.bigTitle}>...why not add one more?</Typography>
      </div>
      <div id="line"></div>
      <Typography className={classes.description}>Answer a few questions about who you are and the things that you like to do—let us handle the rest. </Typography>
      
      <LinkContainer to={ROUTES.QUIZ}>
        <Button margin="40px 0px 0px 0px">TAKE THE QUIZ</Button>
      </LinkContainer>

      <div id="bottom-text">
        <Typography className={classes.alreadyHasAccount}>
          Already have an account? <Link to={ROUTES.SIGN_IN}>Log in</Link>
        </Typography>
      </div>
    </div>
  </div>
);

export default withStyles(styles)(Landing);