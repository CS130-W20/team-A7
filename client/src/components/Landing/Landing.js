import React from 'react';
import { Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import background from '../../assets/background.png';
import { Link } from 'react-router-dom';  
import * as ROUTES from '../../constants/routes';

import CTAButton from '../CTAButton/CTAButton';
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
  <div id="landing-container">
    <div id="landing-content-container">
      <div id="landing-title-container">
        <Typography className={classes.smallTitle}>Life's already full of surprises...</Typography>
        <Typography className={classes.bigTitle}>...why not add one more?</Typography>
      </div>
      <div id="landing-line"></div>
      <Typography className={classes.description}>Answer a few questions about who you are and the things that you like to do—let us handle the rest. </Typography>
      
      <Link to={ROUTES.QUIZ}>
        <CTAButton margin="40px 0px 0px 0px">TAKE THE QUIZ</CTAButton>
      </Link>

      <div id="landing-bottom-text">
        <Typography className={classes.alreadyHasAccount}>
          Already have an account? <Link to={ROUTES.SIGN_IN}>Log in</Link>
        </Typography>
      </div>
    </div>
  </div>
);

export default withStyles(styles)(Landing);