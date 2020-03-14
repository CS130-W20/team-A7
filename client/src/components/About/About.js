
import React from 'react';
import { Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import background from '../../assets/background.png';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';

import './index.css';

const styles = () => ({
  smallTitle: {
    fontFamily: 'Indie Flower',
    fontSize: 42,
    color: 'white',
    textAlign: 'left'
  },
  bigTitle: {
    fontFamily: 'Indie Flower',
    fontSize: 68,
    color: 'white',
    textAlign: 'left'
  },
  description: {
    width: '80%',
    fontSize: 20,
    color: 'white',
    textAlign: 'left'
  }
})

const About = ({ classes }) => (
  <div id="container">
    <img src={background} id="background"/>
    <div id="content-container">
      <div id="title-container">
        <Typography className={classes.bigTitle}>About Us </Typography>
        <div id="line"></div>
      </div>
      <div id="description-container">
      <Typography className={classes.smallTitle}>Our Mission</Typography>
      <Typography className={classes.description}> 
        Ready to take your travel spontaneity to the next level? Here at Serendipity, we believe there is beauty to be found 
        in every single city out there, many of which one would never think to travel to. Our mission is to connect adventurous travelers to entirely random destinations, while still 
        taking into account important restrictions like travel dates and budget. 
      </Typography>
      <Typography className={classes.smallTitle}>How it Works</Typography>
      <Typography className={classes.description}> 
      All you need to do to get started is take <Link to={ROUTES.QUIZ}>our Quiz</Link>. You'll indicate your desired trip dates and budget, and we will take over
      from there! We will generate a full trip plan for you, complete with flights and hotel, and show you what the cost will be. From here you can click book and only then
      will your final destination be revealed! You could be going to Lincoln, Nebraska or Nusa Dua, Bali - so keep an open mind and remember to see the beauty in every city and culture!
      </Typography>
      </div>

    </div>
  </div>
);

export default withStyles(styles)(About);