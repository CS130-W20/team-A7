import React, { Component } from 'react';

import { withStyles } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
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

class BookedTripCard extends Component {
  render() {
    const { classes } = this.props;
    return (
      <Card className={classes.root}>
        <CardMedia
          className={classes.media}
          image={
            "https://upload.wikimedia.org/wikipedia/commons/d/d6/London-Eye-2009.JPG"
          }
        />
        <div className={classes.tripInfo}>
          <CardContent>
            <Typography gutterBottom variant="h4">
              {this.props.trip.name}
            </Typography>
            <div className={classes.details}>
              <Typography variant="body1" gutterBottom>
                {this.props.trip.departureFlight.departureCity} to {this.props.trip.departureFlight.destinationCity}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                <i> {this.props.trip.departureFlight.departureDate} to {this.props.trip.returnFlight.departureDate} </i>
              </Typography>
            </div>
          </CardContent>
        </div>
      </Card>
    );
  }
}

export default withStyles(styles)(BookedTripCard);