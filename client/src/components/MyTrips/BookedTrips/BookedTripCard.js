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
import FlightTakeoffIcon from '@material-ui/icons/FlightTakeoff';
import FlightLandIcon from '@material-ui/icons/FlightLand';
import HotelIcon from '@material-ui/icons/Hotel';
import LocalActivityIcon from '@material-ui/icons/LocalActivity';
import { getCityImage } from '../../Places/places.js'

const styles = theme => ({
  button: {
    textAlign: "left",
    margin: "auto",
    width: "100%",
  },
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
  
  const { onClose,  open , details, classes} = props;

  const handleClose = () => {
    onClose();
  };

  console.log('debug: ', details);

  return (
    <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open} maxWidth="md" fullWidth="true">
      <DialogTitle id="simple-dialog-title">Trip Details - {details.departureFlight.destinationCity}</DialogTitle>
      <List>
          <ListItem >
          <FlightTakeoffIcon />  <ListItemText  primary={"Outbound Flight: "} secondary={details.departureFlight.departureCity + " (" + details.departureFlight.departureAirport.code + ") to " + details.departureFlight.destinationCity + " (" + details.departureFlight.destinationAirport.code + ")   -   " + details.departureFlight.departureDate} />
          </ListItem>
          <ListItem>
          <FlightLandIcon /><ListItemText primary="Return Flight: " secondary={details.returnFlight.departureCity + " (" + details.returnFlight.departureAirport.code + ") to " + details.returnFlight.destinationCity + " (" + details.returnFlight.destinationAirport.code + ")   -   " + details.returnFlight.departureDate} />
          </ListItem>
          <ListItem>
          <HotelIcon /><ListItemText primary="Hotel: " secondary = {details.hotelStay.hotelResult.name +"  -  "+ details.hotelStay.hotelResult.rating +" star hotel"}   />
          </ListItem>
          <ListItem>
          <LocalActivityIcon/><ListItemText primary={"Things to do in " +  details.departureFlight.destinationCity + ": "} />
          </ListItem>
      </List>
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
              {details.name}
            </Typography>
            <div className={classes.details}>
              <Typography variant="body1" gutterBottom>
                {details.departureFlight.departureCity} to {details.departureFlight.destinationCity}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                <i> {details.departureFlight.departureDate} to {details.returnFlight.departureDate} </i>
              </Typography>
            </div>
          </CardContent>
        </div>
        
      </Card>
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
    
  const { classes, trip} = this.props;

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
      <SimpleDialog  open={this.state.open} onClose={handleClose} details={trip} classes={classes}/>
      
      <ButtonBase className={classes.button} onClick={handleClickOpen}>
        <Card className={classes.root} >
            <CardMedia
              className={classes.media}
              image={
                getCityImage(this.props.trip.departureFlight.destinationCity)
              }
            />
            <div>
              <CardContent>
                <Typography variant="h4">
                  {this.props.trip.name}
                </Typography>
                <div className={classes.details}>
                  <Typography variant="body1">
                    {this.props.trip.departureFlight.departureCity} to {this.props.trip.departureFlight.destinationCity}
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    <i> {this.props.trip.departureFlight.departureDate} to {this.props.trip.returnFlight.departureDate} </i>
                  </Typography>
                </div>
              </CardContent>
            </div>
        </Card>
      </ButtonBase>
      </div>
    );
  }
}

export default withStyles(styles)(BookedTripCard);