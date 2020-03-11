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
import { getCityImage, getFormattedAddress, getCityWebsite } from '../../Places/Places.js'

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
    height: 275,
    width: 275,
    marginLeft: theme.spacing(2),
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
  icon: {
    marginRight: 20,
  }
});

function SimpleDialog(props) {
  
  const { onClose,  open , details, classes, destinationAddress} = props;

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open} maxWidth="md" fullWidth={true}>
      <DialogTitle id="simple-dialog-title">Trip Details - {destinationAddress}</DialogTitle>
      <List>
          <ListItem >
          <FlightTakeoffIcon className={classes.icon} /> <ListItemText  primary={"Outbound Flight: "} secondary={details.departureFlight.departureCity + " (" + details.departureFlight.departureAirport.code + ") to " + details.departureFlight.destinationCity + " (" + details.departureFlight.destinationAirport.code + ")   -   " + details.departureFlight.departureDate} />
          </ListItem>
          <ListItem>
          <FlightLandIcon className={classes.icon} /> <ListItemText primary="Return Flight: " secondary={details.returnFlight.departureCity + " (" + details.returnFlight.departureAirport.code + ") to " + details.returnFlight.destinationCity + " (" + details.returnFlight.destinationAirport.code + ")   -   " + details.returnFlight.departureDate} />
          </ListItem>
          <ListItem>
          <HotelIcon className={classes.icon} /> <ListItemText primary="Hotel: " secondary = {details.hotelStay.hotelResult.name +"  -  "+ details.hotelStay.hotelResult.rating +" star hotel"}   />
          </ListItem>
          <ListItem>
          <LocalActivityIcon className={classes.icon} /> <ListItemText primary={"Things to do in " +  details.departureFlight.destinationCity + ": "} />
          </ListItem>
      </List>
      <Card className={classes.root} >
        <CardMedia
          className={classes.media}
          image={
            "https://upload.wikimedia.org/wikipedia/commons/d/d6/London-Eye-2009.JPG"
          }
        />
        <div className={classes.tripInfo} >
          <CardContent>
            <Typography gutterBottom variant="h4">
              {"Attraction1Name"}
            </Typography>
            <div className={classes.details}>
              <Typography variant="body1" gutterBottom>
              {"*number of stars*"} stars <br></br> {"*description of attraction*"}
              </Typography>
              <Typography variant="body1" color="textSecondary">
              <i> <a href="google.com">More Information</a> </i>  
              </Typography>
            </div>
          </CardContent>
        </div>

      </Card>
      <Card className={classes.root}>
        <CardMedia
          className={classes.media}
          image={
            "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Green_Dragon_Tavern_%2836196%29.jpg/1920px-Green_Dragon_Tavern_%2836196%29.jpg"
          }
        />
        <div className={classes.tripInfo}>
          <CardContent>
            <Typography gutterBottom variant="h4">
              {"Attraction2Name"}
            </Typography>
            <div className={classes.details}>
              <Typography variant="body1" gutterBottom>
                {"*number of stars*"} stars <br></br> {"*description of attraction*nqlwjknf "}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                <i> <a href="google.com">More Information</a> </i>
              </Typography>
            </div>
          </CardContent>
        </div>
        
      </Card>
      <Card className={classes.root}>
        <CardMedia
          className={classes.media}
          image={
            "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/MV_Pemulwuy_at_Milsons_Point%2C_November_2016_%284%29.jpg/1920px-MV_Pemulwuy_at_Milsons_Point%2C_November_2016_%284%29.jpg"
          }
        />
        <div className={classes.tripInfo}>
          <CardContent>
            <Typography gutterBottom variant="h4">
              {"Attraction3Name"}
            </Typography>
            <div className={classes.details}>
              <Typography variant="body1" gutterBottom>
              {"*number of stars*"} stars <br></br> {"*description of attraction*nqlwjknf"}
              </Typography>
              <Typography variant="body1" color="textSecondary">
              <i> <a href="google.com">More Information</a> </i>
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
      open: false,
      sourceAddress: '',
      destinationAddress: '',
      destinationImage: null,
      destinationWebsite: '',
      srcAddDone: false,
      desAddDone: false,
      destImgDone: false,
      destWbstDone: false,
    };
  }

  setSourceAddress(addy) {
    if (typeof addy !== 'undefined' && addy !== '') {
      this.setState({
        sourceAddress: addy,
      });
    }
  }

  setDestinationAddress(addy) {
    if (typeof addy !== 'undefined' && addy !== '') {
      this.setState({
        destinationAddress: addy,
      });
    }
  }

  setDestinationImage(url) {
    if (typeof url !== 'undefined' && url !== null) {
      this.setState({
        destinationImage: url,
      });
    }
  }

  setDestinationWebsite(url) {
    if (typeof url !== 'undefined' && url !== null) {
      this.setState({
        destinationWebsite: url,
      });
    }
  }
  
  srcAddIsDone() {
    this.setState({
      srcAddDone : true
    });
  }
  
  desAddIsDone() {
    this.setState({
      desAddDone : true
    });
  }
  
  destImgIsDone() {
    this.setState({
      destImgDone : true
    });
  }
  
  destWbstIsDone() {
    this.setState({
      destWbstDone : true
    });
  }

  componentDidMount() {
    const setSourceAddress_c = ((addy) => this.setSourceAddress(addy));
    const setDestinationAddress_c = ((addy) => this.setDestinationAddress(addy));
    const setDestinationImage_c = ((url) => this.setDestinationImage(url));
    const setDestinationWebsite_c = ((url) => this.setDestinationWebsite(url));
    const srcAddIsDone_c = (() => this.srcAddIsDone());
    const desAddIsDone_c = (() => this.desAddIsDone());
    const destImgIsDone_c = (() => this.destImgIsDone());
    const destWbstIsDone_c = (() => this.destWbstIsDone());

    if (!this.state.srcAddDone) {
      getFormattedAddress(this.props.trip.departureFlight.departureCity).then(function (addy) {
        setSourceAddress_c(addy);
        srcAddIsDone_c();
      });
    }

    if (!this.state.desAddDone) {
      getFormattedAddress(this.props.trip.departureFlight.destinationCity).then(function (addy) {
        setDestinationAddress_c(addy);
        desAddIsDone_c();
      });
    }

    if (!this.state.destImgDone) {
      getCityImage(this.props.trip.departureFlight.destinationCity).then(function (url) {
        setDestinationImage_c(url);
        destImgIsDone_c();
      });
    }

    if (!this.state.destWbstDone) {
      getCityWebsite(this.props.trip.departureFlight.destinationCity).then(function (url) {
        setDestinationWebsite_c(url);
        destWbstIsDone_c();
      });
    }
  }

  render() {
    
  const { classes, trip } = this.props;

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
      <SimpleDialog  open={this.state.open} onClose={handleClose} details={trip} classes={classes} destinationAddress={this.state.destinationAddress}/>
      
      <ButtonBase className={classes.button} onClick={handleClickOpen}>
        <Card className={classes.root} >
            <CardMedia
              className={classes.media}
              image={this.state.destinationImage}
            />
            <div>
              <CardContent>
                <div className={classes.details}>
                  <Typography style={{marginBottom: 10, marginTop: 20}} variant="h4">
                    {this.state.sourceAddress} to {this.state.destinationAddress} (${this.props.trip.price})
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    <i> {this.props.trip.departureFlight.departureDate} to {this.props.trip.returnFlight.departureDate} </i>
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    <a href={this.state.destinationWebsite} target="_blank">{this.state.destinationWebsite}</a>
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