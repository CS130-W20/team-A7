import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import plane from '../../../assets/plane.png';

const styles = () => ({
  container: {
    display: 'flex',
    alignItems: 'center',
  },
  planeImage: {
    width: 30,
    height: 30,
    marginLeft: 100,
    marginRight: 100
  },
  airportCode: {
    display: 'inline',
    fontSize: 36,
    marginRight: 8
  },
  time: {
    display: 'inline',
    fontFamily: 'Arial',
    fontSize: 36,
    fontWeight: 'bold'
  },
  date: {
    fontSize: 18
  }
});

function FlightRoute(props) {
  const {
    departureAirport,
    departureTime,
    departureDate,
    destinationAirport,
    destinationTime,
    destinationDate,
    style,
    classes
  } = props;

  return (
    <div className={classes.container} style={style}>
      <div className={classes.itemContainer}>
        <Typography className={classes.airportCode} style={{textAlign: 'right'}}>{departureAirport}</Typography>
        <Typography className={classes.time} style={{textAlign: 'right'}}>{departureTime}</Typography>
        <Typography className={classes.date} style={{textAlign: 'right'}}>{departureDate}</Typography>
      </div>
      <img src={plane} className={classes.planeImage} />
      <div>
        <Typography className={classes.airportCode}>{destinationAirport}</Typography>
        <Typography className={classes.time}>{destinationTime}</Typography>
        <Typography className={classes.date}>{destinationDate}</Typography>
      </div>
    </div>
  );
}

export default withStyles(styles)(FlightRoute);