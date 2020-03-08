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
          <Container className={styles.item}>
            Departure Airport: {values.departureAirport.code} <br />
            Departure Date: { values.departureDate.toDateString() } <br />
            Return Date: { values.returnDate.toDateString() } <br />
            Price: {values.totalPrice} <br />
          </Container>
          <Container>
            <Button label="retakeQuiz"
            type="submit"
            onClick={this.retakeQuiz}
            variant="contained">
              Retake Quiz
            </Button>
            <Button label="saveTrip"
            type="submit"
            onClick={this.saveTrip}
            variant="contained">
              Save Trip
            </Button>
            <Button label="book"
            type="submit"
            onClick={this.onClick}
            variant="contained">
              Book
            </Button>
          </Container>
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
    const { values, setTripData, setApiErr, setTotalPrice, classes } = this.props;
    var tripDestination = "";
    var departDate = values.departureDate.toISOString();
    departDate = departDate.slice(0,10);
    var returnDate = values.returnDate.toISOString();
    returnDate = returnDate.slice(0, 10);
    // Default value so the API request doesn't crash the mf webpage
    var airportPlace = null;
    var apiErr = null;
    var retryIndex = 0;
    var internationalIndex = Math.floor(Math.random() * 8);
    const internationalLocations = ["FR", "UK", "ES", "CA", "DK", "IT", "JP", "PL"];
    var budgetLeft = (values.budget + 25) * 10;
    var tripSuccess = false;
    
    function startOutFlight() {
      console.log("ATTEMPTING TRIP GENERATION", retryIndex);
      return new Promise((resolve, reject) => {
        var outDestination = ((values.destination === 'withinUS') ? "US" : ((values.destination === 'international') ? internationalLocations[internationalIndex] : "anywhere"));
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
          if (numResults == 0 || retryIndex > numResults - 1) {
            apiErr = "No results found. Please try new flight information."
            resolve(undefined);
            return;
          }
  
          // Limit the possible values if there's a budget
          if (values.price === 'underBudget') {
            //reserve percentage of funds for outbound flight based on trip type. international more likely to be expensive.
            const outBudget = (values.destination === 'international') ? Math.floor(budgetLeft/3) : Math.floor(budgetLeft/4);
            var budgetQuotes = quotes.filter(q => (q.MinPrice <= outBudget));
            if (budgetQuotes.length == 0) {
              setApiErr("Budget is too small for current trip.");
              resolve(undefined);
              return;
            }
            
            quotes = budgetQuotes;
            numResults = budgetQuotes.length;
          }
          
          // Order the flights by price to make selection easier
          quotes.sort((a, b) => (a.MinPrice > b.MinPrice) ? 1 : -1);
          //Get the index of which entry we should use. 
          //If cheapest, take first entry because it's ordered by price.
          //If under budget, take last entry because we want the most bang for our buck of our allocated flight funds
          //If cost isn't a consideration, we'll take most expensive (last) entry.
          var tripIndex = ((values.price === 'cheapest') ? retryIndex : ((values.price === 'underBudget') ? numResults - 1 - retryIndex : numResults - 1));
          var chosenQuote = quotes[tripIndex];
          chosenQuote.carriers = carriers;
          airportPlace = res.body.Places.find(element => element.PlaceId == chosenQuote.OutboundLeg.DestinationId);
          chosenQuote.airport = airportPlace;
          if (values.price === 'underBudget') {
            budgetLeft -= chosenQuote.MinPrice;
          }
          resolve(chosenQuote);
        });
      });
    }
    
    function startInFlight(outFlight) {
      return new Promise((resolve, reject) => {
        if (typeof outFlight === 'undefined') {
          resolve(undefined);
          return;
        }
        
        var inDeparture = airportPlace.SkyscannerCode;
        tripDestination = airportPlace.CityName;
        console.log(tripDestination);
        var inFlightUrl = "https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/US/USD/en-US/" + inDeparture + "-sky/" + values.departureAirport.code + "-sky/" + returnDate;
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
            var inQuotes = inRes.body.Quotes;
            var numResults = inQuotes.length;
            if (numResults == 0) {
              apiErr = "No returning flights found. Trying a new trip.";
              resolve(undefined);
              return;
            }
            var inCarriers = {carriers : inRes.body.Carriers};
            //Sort by price once more
            inQuotes.sort((a, b) => (a.MinPrice > b.MinPrice) ? 1 : -1);
            
            if (values.price === 'underBudget') {
              //reserve percentage of funds for inbound flight based on trip type and amount of funds left. international more likely to be expensive.
              // International: (2/3)/2 => 1/3 of original budget reserved for inbound flight
              // Otherwise: (3/4)/3 => 1/4 of original budget reserved for inbound flight 
              const inBudget = (values.destination === 'international') ? Math.floor(budgetLeft/2) : Math.floor(budgetLeft/3);
              var budgetQuotes = inQuotes.filter(q => (q.MinPrice <= inBudget));
              if (budgetQuotes.length == 0) {
                setApiErr("Budget is too small for current trip.");
                resolve(undefined);
                return;
              }
              inQuotes = budgetQuotes;
              numResults = budgetQuotes.length;
            }
            
            //Get the index of which entry we should use. 
            //If cheapest, take first entry because it's ordered by price.
            //If under budget, take last entry because we want the most bang for our buck of our allocated flight funds
            //If cost isn't a consideration, we'll take most expensive (last) entry.
            var tripIndex = ((values.price === 'cheapest') ? 0 : numResults - 1 );
            var chosenInQuote = inQuotes[tripIndex];
            if (values.price === 'underBudget') {
              budgetLeft -= chosenInQuote.MinPrice;
            }
            chosenInQuote = {chosenInQuote, inCarriers};
            resolve(chosenInQuote);
        });
      });
    }

    function startPlace(outFlight, inFlight) {
      return new Promise ((resolve, reject) => {
        if ((typeof outFlight === 'undefined') || (typeof inFlight === 'undefined')) {
          resolve(undefined);
          return;
        }
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
          resolve(locationId);
        });
      });
    }
    
    function startHotel(outFlight, inFlight, placeId) {
      return new Promise ((resolve, reject) => {
        if ((typeof placeId === 'undefined') || (typeof outFlight === 'undefined') || (typeof inFlight === 'undefined')) {
          resolve(undefined);
          return;
        }
        var unirest = require("unirest");
        var req = unirest("GET", "https://tripadvisor1.p.rapidapi.com/hotels/list");
        var checkInDate = outFlight.OutboundLeg.DepartureDate.slice(0,10);
        var numNights = (values.returnDate.getTime() - values.departureDate.getTime())/(1000*3600*24);
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
          hotels = hotels.filter(hotel => ((hotel.hac_offers.availability == "available" || hotel.hac_offers.availability == "pending") && hotel.hasOwnProperty('price')));
          var numResults = hotels.length;
          if (numResults == 0) {
            apiErr = "No available hotels in the area we searched. Trying a new trip!";
            resolve(undefined);
            return;
          }

          const regex = /[0-9]+/;
          //Hotel price is represented as a range "$xx - $yy" or single "$zz", so we need to get the cheaper limit thru regex
          hotels.forEach(function (item, index) {
            var price = item.price.match(regex);
            item.price = parseInt(price[0]);
          });

          hotels.sort((a, b) => (a.price > b.price) ? 1 : -1);
          
          if (values.price === 'underBudget') {
            //Spend the rest of the budget on a hotel!
            const nightlyBudget = budgetLeft / numNights;
            var budgetHotels = hotels.filter(hotel => (hotel.price <= nightlyBudget));
            if (budgetHotels.length == 0) {
              //We made it this far so we're giving them the cheapest hotel to try and stay near budget!
              numResults = 1;
            } else {
              hotels = budgetHotels;
              numResults = budgetHotels.length;
            }
          }
          
          //Same index selection logic as before. Give them the cheapest, otherwise the most expensive within their budget.
          var hotelIndex = ((values.price === 'cheapest') ? 0 : numResults - 1 );
          var hotelResult = hotels[hotelIndex];
          hotelResult = {hotelResult, numNights};
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
      return startOutFlight().then(function(outFlight) {
        return startInFlight(outFlight).then(inFlight => [outFlight, inFlight]);
      }).then(function([outFlight, inFlight]) {
        return startPlace(outFlight, inFlight).then(placeId => [outFlight, inFlight, placeId]);
      }).then(function([outFlight, inFlight, placeId]) {
        return startHotel(outFlight, inFlight, placeId).then(hotelResult => [outFlight, inFlight, placeId, hotelResult]);
      }).then(function([outFlight, inFlight, placeId, hotelResult]) {
        return getAllInfo(outFlight, inFlight, placeId, hotelResult);
      }).then(results => {
        console.log(results);
        if ((typeof results[0] === 'undefined') || (typeof results[1] === 'undefined') || (typeof results[3] === 'undefined')) {
          setApiErr(apiErr);
          return;
        }

        //console.log("outbound flight: ", results[0].OutboundLeg.DepartureDate);
        //console.log("inbound flight: ", results[1].chosenInQuote.OutboundLeg.DepartureDate);

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

        // Set the new state and exit out of recursion loop
        setTripData(trip, hotelStay, price);
        tripSuccess = true;
        retryIndex = MAX_TRIES;
      });
    }
    
    function attemptTrip() {
        return new Promise(resolve => {generateTrip().then(result => {
          if (retryIndex < MAX_TRIES) {
            //If trip fails, scramble parameters and reset state.
            console.log("TRIP GENERATION ATTEMPT", retryIndex, "FAILED");
            retryIndex++;
            budgetLeft = ((values.budget+25) * 10);
            internationalIndex = Math.floor(Math.random() * 8);
            setApiErr(null);
            resolve(attemptTrip());
          } else {
            console.log("TRIP GENERATION ENDING");
            if (tripSuccess == false) {
              setTotalPrice(0);
              setApiErr("Please try new parameters.");
              console.log("All trips failed");
            }
            resolve(0);
          }
        });
      });
    }
    
    //We try to generate a trip *up to* MAX_TRIES times.
    attemptTrip().then(() => {
      console.log("Finishing attempts to generate a trip.")
    });
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
