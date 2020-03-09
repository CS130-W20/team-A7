import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { withStyles } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import ButtonBase from '@material-ui/core/ButtonBase';

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

function SimpleDialog(props) {
  
  const { onClose,  open } = props;
  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open} maxWidth="md" fullWidth="true">
      <DialogTitle id="simple-dialog-title">Trip Details</DialogTitle>
      <List>
          <ListItem >
            <ListItemText primary="Outbound Flight: Airport - Date" />
          </ListItem>
          <ListItem>
          <ListItemText primary="Return Flight: Airport - Date" />
          </ListItem>
          <ListItem>
          <ListItemText primary="Hotel: Motel 6 - 5 stars " />
          </ListItem>
          <ListItem>
          <ListItemText primary="Things to do in [this city]:" />
          </ListItem>
      </List>
    </Dialog>
  );
}

SimpleDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

class BookedTripCard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }

  render() {
    
  const { classes } = this.props;
  const handleClickOpen = () => {
    this.setState({
      open: true
    });
  };
  const handleClose = () => {
    this.setState({
      open: false
    });
  };

    return (
      <div>
      <SimpleDialog  open={this.state.open} onClose={handleClose} />
      
      <Card className={classes.root}>
        <ButtonBase
          className={this.props.classes.cardAction}
          onClick={handleClickOpen}
        >
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
                <i> {this.props.trip.departureFlight.departureDate.toDateString()} to {this.props.trip.returnFlight.departureDate.toDateString()} </i>
              </Typography>
            </div>
          </CardContent>
        </div>
        </ButtonBase>
      </Card>
      </div>
    );
  }
}

export default withStyles(styles)(BookedTripCard);