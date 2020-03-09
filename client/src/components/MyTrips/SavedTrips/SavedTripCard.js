import React, { Component } from 'react';

import { withStyles } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

const styles = theme => ({
  root: {
    margin: "auto",
    width: "85%",
    height: 300,
    overflow: "initial",
    borderRadius: theme.spacing(2), // 16px
    boxShadow: "0px 14px 80px rgba(34, 35, 58, 0.2)",
    position: "relative",
    marginLeft: "auto",
    background: "#ffffff",
    display: "flex",
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2)
  },
  media: {
    height: 300,
    width: 300,
    marginLeft: theme.spacing(-2),
    marginRight: theme.spacing(1),
    borderRadius: theme.spacing(2),
    backgroundColor: "#fff",
    paddingRight: "10%"
  },
  tripInfo: {
    display: "flex",
    flexDirection: "column"
  },
  details: {
    marginLeft: theme.spacing(1),
  },
});

class SavedTripCard extends Component {
  render() {
    const { classes } = this.props;
    return (
      <Card className={classes.root}>
        <div className={classes.tripInfo}>
          <CardContent>
            <Typography gutterBottom variant="h3">
              {this.props.trip.price}
            </Typography>
            <div className={classes.details}>
              <Typography variant="body1" gutterBottom>
                Departing from: {this.props.trip.criteria.departureAirport.city}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                <i> {this.props.trip.criteria.departureDate} to {this.props.trip.criteria.returnDate} </i>
              </Typography>
            </div>
          </CardContent>
        </div>
      </Card>
    );
  }
}

export default withStyles(styles)(SavedTripCard);