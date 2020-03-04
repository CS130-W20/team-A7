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
    // alignItems: "center",
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
    marginLeft: theme.spacing(1);
  },
});

class TripCard extends Component {
  constructor(props) {
    super(props);
  }
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
              Trip Name
            </Typography>
            <div className={classes.details}>
              <Typography variant="body1" gutterBottom>
                Los Angeles to London
              </Typography>
              <Typography variant="body1" color="textSecondary">
                <i> March 2 to March 15 </i>
              </Typography>
            </div>
          </CardContent>
        </div>
      </Card>
    );
  }
}

export default TripCard;