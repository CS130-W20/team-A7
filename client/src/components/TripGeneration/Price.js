import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import BookedTrip, {Flight, HotelStay} from '../MyTrips/BookedTrips/BookedTrip.js';
import Card from '@material-ui/core/Card'
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';

const MAX_TRIES = 5;

const styles = (theme) => ({
  card: {
    marginTop: 50,
    width: 500,
    minHeight: 250,
    margin: "auto",
    transition: "0.3s",
    boxShadow: "0 8px 40px -12px rgba(0,0,0,0.3)",
    "&:hover": {
      boxShadow: "0 16px 70px -12.125px rgba(0,0,0,0.3)"
    }
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  circle: {
    marginTop: 30
  }
});

class GeneratingCard extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { styles } = this.props;

    return (
      <div id="centered-fixed-masthead">
        <Card className={styles.card}>
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={styles.paper}>
              <Typography component="h1" variant="h5">
                Generating...
              </Typography>
            </div>
          </Container>
          <div className={styles.item}>
            <CircularProgress className={styles.circle}/>
          </div>
        </Card>
      </div>
    );
  }
}

class GeneratedCard extends Component {
  constructor(props) {
    super(props);
  }

  onClick = e => {
    e.preventDefault();
    // Writing to firebase
    const { values } = this.props;
    console.log("saved info: ", values.generatedTrip);
    console.log("saved info: ", values.hotel);
  }

  render() {
    const { styles, values } = this.props;

    return (
      <div id="centered-fixed-masthead">
        <Card className={styles.card}>
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={styles.paper}>
              <Typography component="h1" variant="h5">
                Trip Details...
              </Typography>
            </div>
          </Container>
          <div className={styles.item}>
            Departure Airport: {values.departureAirport.code} <br />
            Departure Date: { values.departureDate.toDateString() } <br />
            Return Date: { values.returnDate.toDateString() } <br />
            Price: {values.totalPrice} <br />
          </div>
          <Button label="book"
          type="submit"
          disabled={0}
          onClick={this.onClick}
          fullWidth
          variant="contained">
            Book
          </Button>
        </Card>
      </div>
    );
  }
}

class Price extends Component {

  constructor(props) {
    super(props);
    this.state = {
      trip: null,
      hotel : null,
    }
  }
  
  continue = e => {
    e.preventDefault();
    this.props.nextStep();
  };
  
  componentDidMount() {
    const { values, setTripData, setApiErr, classes } = this.props;
    var tripDestination = "";
    var departDate = values.departureDate.toISOString();
    departDate = departDate.slice(0,10);
    var returnDate = values.returnDate.toISOString();
    returnDate = returnDate.slice(0, 10);
    // Default value so the API request doesn't crash the mf webpage
    var airportPlace = null;
    var apiErr = null;
    var cheapestIndex = 0;
    
    function startOutFlight() {
      console.log("ATTEMPTING TRIP GENERATION", cheapestIndex);
      return new Promise((resolve, reject) => {
        var outDestination = values.withinUS ? "US" : "anywhere";
        var unirest = require("unirest");
 
        var outFlightUrl = "https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/US/USD/en-US/" + values.departureAirport.code + "-sky/" + outDestination + "/" + departDate;
        var outFlightReq = unirest("GET", outFlightUrl);
           
        // Leaving this blank ensures we get a one-way flight. The API is crap and doesn't guarantee if it returns one-way or two-way flights so this is a precaution!
        outFlightReq.query({
          "inboundpartialdate": ""
        });

        outFlightReq.headers({
          "x-rapidapi-host": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
          "x-rapidapi-key": "c0df19373bmshbec042d361c58f1p176ba3jsnb25321ccb0ab"
        });
            
        outFlightReq.end(function (res) {
          if (res.error) throw new Error(res.error);
          //return resolve(res);
          var quotes = res.body.Quotes;
          var carriers = res.body.Carriers;
          
          var numResults = quotes.length;
          //We try UP TO 5 times. If there's no results then we give up.
          if (numResults == 0 || cheapestIndex > numResults - 1) {
            apiErr = "No results found. Please try new flight information."
            resolve(undefined);
          }
  
          // Order the flights by price
          quotes.sort((a, b) => (a.MinPrice > b.MinPrice) ? 1 : -1);
        
          //Get the index of which entry we should use. If cheapest selected take the first entry b/c it's ordered.
          var tripIndex = values.cheapest ? cheapestIndex : Math.floor(Math.random() * numResults);
          var chosenQuote = quotes[tripIndex];
          chosenQuote.carriers = carriers;
          airportPlace = res.body.Places.find(element => element.PlaceId == chosenQuote.OutboundLeg.DestinationId);
          //console.log(chosenQuote);
          chosenQuote.airport = airportPlace;
          resolve(chosenQuote);
        });
      });
    }
    
    function startInFlight(outFlight) {
      return new Promise((resolve, reject) => {
        var inDeparture = airportPlace.SkyscannerCode;
        tripDestination = airportPlace.CityName;
        console.log(tripDestination);
        var inFlightUrl = "https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/US/USD/en-US/" + inDeparture + "-sky/" + values.departureAirport.code + "-sky/" + returnDate;
        console.log(inFlightUrl);
        var unirest = require("unirest");
        var inFlightReq = unirest("GET", inFlightUrl);
        inFlightReq.query({
          "inboundpartialdate": ""
        });
               
        inFlightReq.headers({
          "x-rapidapi-host": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
          "x-rapidapi-key": "c0df19373bmshbec042d361c58f1p176ba3jsnb25321ccb0ab"
        });
                
        //INBOUND FLIGHT
        inFlightReq.end(function (inRes) {
          if (inRes.error) throw new Error(inRes.error);
            //console.log(inRes);
            var inQuotes = inRes.body.Quotes;
            var numResults = inQuotes.length;
            if (numResults == 0) {
              apiErr = "No returning flights found. Trying a new destination...";
            }
            var inCarriers = {carriers : inRes.body.Carriers};
            inQuotes.sort((a, b) => (a.MinPrice > b.MinPrice) ? 1 : -1);
            //take the cheapest flight back
            var chosenInQuote = inQuotes[0];
            //console.log("chosen in quote");
            //console.log(chosenInQuote);
            chosenInQuote = {chosenInQuote, inCarriers};
            //console.log(chosenInQuote);
            resolve(chosenInQuote);
        });
      });
    }

    function startPlace(outFlight, inFlight) {
      return new Promise ((resolve, reject) => {
        var unirest = require("unirest");

        var req = unirest("GET", "https://tripadvisor1.p.rapidapi.com/locations/search");
       
        req.query({
          "location_id" : "1",
          "limit": "5",
          "sort": "relevance",
          "offset": "0",
          "lang": "en_US",
          "currency": "USD",
          "units": "mi",
          "query": (airportPlace === null ? "Los Angeles" : airportPlace.CityName),
        });

        req.headers({
          "x-rapidapi-host": "tripadvisor1.p.rapidapi.com",
          "x-rapidapi-key": "c0df19373bmshbec042d361c58f1p176ba3jsnb25321ccb0ab"
        });


        req.end(function (res) {
          if (res.error) throw new Error(res.error);
          var locationId = res.body.data[0].result_object.location_id;
          //console.log(res.body);
          //console.log(locationId);
          resolve(locationId);
        });
      });
    }
    
    function startHotel(outFlight, inFlight, placeId) {
      return new Promise ((resolve, reject) => {
        var unirest = require("unirest");

        var req = unirest("GET", "https://tripadvisor1.p.rapidapi.com/hotels/list");

        var checkInDate = outFlight.OutboundLeg.DepartureDate.slice(0,10);
        //console.log(checkInDate);
        var numNights = (values.returnDate.getTime() - values.departureDate.getTime())/(1000*3600*24);
        //console.log(numNights);
        req.query({
          "offset": "0",
          "subcategory": "hotel%2Clodge",
          "hotel_class": "1%2C2%2C3",
          "currency": "USD",
          "limit": "20",
          "checkin": checkInDate,
          "order": "asc",
          "lang": "en_US",
          "sort": "price",
          "nights": numNights.toString(),
          "location_id": placeId.toString(),
          "adults": "1",
          "rooms": "1"
        });

        req.headers({
          "x-rapidapi-host": "tripadvisor1.p.rapidapi.com",
          "x-rapidapi-key": "c0df19373bmshbec042d361c58f1p176ba3jsnb25321ccb0ab"
        });


        req.end(function (res) {
          if (res.error) throw new Error(res.error);

          var hotels = res.body.data;
          //console.log(hotels);
          hotels = hotels.filter(hotel => ((hotel.hac_offers.availability == "available" || hotel.hac_offers.availability == "pending") && hotel.hasOwnProperty('price')));
          //console.log(hotels);
          if (hotels.length == 0) {
            apiErr = "No available hotels in the area we searched. Woops! Please retry the quiz.";
            resolve(undefined);
          }

          const regex = /[0-9]+/;
          //Hotel price is represented as a range "$xx - $yy" or single "$zz", so we need to get the cheaper limit thru regex
          hotels.forEach(function (item, index) {
            var price = item.price.match(regex);
            //console.log(price);
            //console.log(price[1]);
            item.price = parseInt(price[0]);
          });

          hotels.sort((a, b) => (a.price > b.price) ? 1 : -1);
          var hotelResult = hotels[0];
          hotelResult = {hotelResult, numNights};
          //console.log(hotelResult);
          resolve(hotelResult);
        });
      });
    }
    
    //Need to package results like this because "this." pointer for Price class can't be called from anonymous functions. Frick u javascript.
    function getAllInfo(outFlight, inFlight, placeId, hotelResult) {
      return new Promise((resolve, reject) => {
        resolve([outFlight, inFlight, placeId, hotelResult]);
      });
    }
    
    function generateTrip(){
      //since this may be called multiple times, stop after it's already done!
      return startOutFlight().then(function(outFlight) {
        return startInFlight(outFlight).then(inFlight => [outFlight, inFlight]);
      }).then(function([outFlight, inFlight]) {
        return startPlace(outFlight, inFlight).then(placeId => [outFlight, inFlight, placeId]);
      }).then(function([outFlight, inFlight, placeId]) {
        return startHotel(outFlight, inFlight, placeId).then(hotelResult => [outFlight, inFlight, placeId, hotelResult]);
      }).then(function([outFlight, inFlight, placeId, hotelResult]) {
        return getAllInfo(outFlight, inFlight, placeId, hotelResult);
      }).then(results => {
        if ((typeof results[0] === 'undefined') || (typeof results[1].chosenInQuote === 'undefined') || (typeof results[3] === 'undefined')) {
          setApiErr(apiErr);
          return;
        }

        console.log("outbound flight: ", results[0].OutboundLeg.DepartureDate);
        console.log("inbound flight: ", results[1].chosenInQuote.OutboundLeg.DepartureDate);

        // Creating the trip object
        var departureDate = new Date(results[0].OutboundLeg.DepartureDate);
        var departureAirline = results[0].carriers.find(carr => carr.CarrierId == results[0].OutboundLeg.CarrierIds[0]).Name;
        var outboundDepartureAirportCode = values.departureAirport.code;
        var outboundDepartureAirportName = values.departureAirport.name;
        var outboundDepartureCity = values.departureAirport.city;
        var outboundDestinationAirportCode = results[0].airport.IataCode;
        var outboundDestinationAirportName = results[0].airport.Name;
        var outboundDestinationCity = results[0].airport.CityName;
        var departureFlight = new Flight(
          outboundDepartureCity,
          outboundDestinationCity,
          departureDate,
          departureAirline,
          {
            name: outboundDepartureAirportName,
            code: outboundDepartureAirportCode,
          },
          {
            name: outboundDestinationAirportName,
            code: outboundDestinationAirportCode,
          },
        );
        
        // Created the Trip object
        var returnDate = new Date(results[1].chosenInQuote.OutboundLeg.DepartureDate);
        var returnAirline = results[1].inCarriers.carriers.find(carr => carr.CarrierId == results[1].chosenInQuote.OutboundLeg.CarrierIds[0]).Name;
        var inboundDepartureAirportName = results[0].airport.Name;
        var inboundDepartureAirportCode = results[0].airport.IataCode;
        var inboundDepartureCity = results[0].airport.CityName;
        var inboundDestinationAirportCode = values.departureAirport.code;
        var inboundDestinationAirportName = values.departureAirport.name;
        var inboundDestinationCity = values.departureAirport.city;
        var returnFlight = new Flight(
          inboundDepartureCity,
          inboundDestinationCity,
          returnDate,
          returnAirline,
          {
            name: inboundDepartureAirportName,
            code: inboundDepartureAirportCode,
          },
          {
            name: inboundDestinationAirportName,
            code: inboundDestinationAirportCode,
          },
        );

        var hotelStay = new HotelStay(results[3].hotelResult, results[3].numNights);
        var trip = new BookedTrip('BookedTrip1', departureFlight, returnFlight, hotelStay);
        
        // Calculating total price
        var price = results[0].MinPrice + results[1].chosenInQuote.MinPrice + (results[3].hotelResult.price * results[3].numNights)

        // Set the new state
        setTripData(trip, hotelStay, price);
        
        cheapestIndex = MAX_TRIES;
      });
    }
    
    function attemptTrip() {
        return new Promise(resolve => {generateTrip().then(result => {
          if (cheapestIndex < MAX_TRIES) {
            console.log("TRIP GENERATION ATTEMPT", cheapestIndex, "FAILED");
            setApiErr(null);
            cheapestIndex++;
            resolve(attemptTrip());
          } else {
            console.log("TRIP GENERATION SUCCEEDED");
            resolve(0);
          }
        });
      });
    }
    
    //We try to generate a trip *up to* MAX_TRIES times.
    attemptTrip().then(() => console.log("Finishing attempts to generate a trip."));
  }

  render() {
    const { classes, values } = this.props;
    
    return (
      <div>
        { values.totalPrice === null ? (values.apiErr === null ? <GeneratingCard styles={classes}/> : values.apiErr) : (values.apiErr === null ? <GeneratedCard styles={classes} values={values}/> : values.apiErr) }
      </div>
    );
  }
}

export { GeneratingCard, GeneratedCard }

export default withStyles(styles)(Price);
