import React, { Component } from 'react';
const MAX_TRIES = 5;

class Price extends Component {
  constructor(props) {
    super(props);
    this.state = {
      outFlight : null,
      inFlight : null,
      hotel : null,
      totalPrice : null,
      error : null,
    }
  }
  
  continue = e => {
    e.preventDefault();
    this.props.nextStep();
  };
  
  
  componentDidMount() {
    const { values, setTripData, setApiErr, classes } = this.props;
    var totalPrice = 0;
    var tripDestination = "";
    var departDate = values.departureDate.toISOString();
    departDate = departDate.slice(0,10);
    var returnDate = values.returnDate.toISOString();
    returnDate = returnDate.slice(0, 10);
    console.log(departDate);
    console.log(returnDate);
    //Default value so the API request doesn't crash the mf webpage
    var airportPlace = null;
    var apiErr = null;
    var cheapestIndex = 0;
    var validTrip = false;
    
    function startOutFlight() {
      console.log("ATTEMPTING TRIP GENERATION", cheapestIndex);
      return new Promise((resolve, reject) => {
        var outDestination = values.withinUS ? "US" : "anywhere";
        var unirest = require("unirest");
 
        var outFlightUrl = "https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/US/USD/en-US/" + values.departureAirport.code + "-sky/" + outDestination + "/" + departDate;
        var totalPrice = 0;
        var outFlightReq = unirest("GET", outFlightUrl);
           
        //Leaving this blank ensures we get a one-way flight. The API is crap and doesn't guarantee if it returns one-way or two-way flights so this is a precaution!
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
                
          //Order the flights by price
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
      }).then(trip => {
        console.log("outbound flight");
        console.log(trip[0]);
        console.log("inbound flight");
        console.log(trip[1]);
        console.log(trip[2]);
        console.log("hotel information");
        console.log(trip[3]);
        if ((trip[0] === undefined) || (trip[1].chosenInQuote === undefined) || (trip[3] === undefined)) {
          setApiErr(apiErr);
          return;
        }
        var price = trip[0].MinPrice + trip[1].chosenInQuote.MinPrice + (trip[3].hotelResult.price * trip[3].numNights)
        var outAirline = trip[0].carriers.find(carr => carr.CarrierId == trip[0].OutboundLeg.CarrierIds[0]); 
        console.log(outAirline.Name);
        var inAirline = trip[1].inCarriers.carriers.find(carr => carr.CarrierId == trip[1].chosenInQuote.OutboundLeg.CarrierIds[0]);
        console.log(inAirline.Name);
        var destination = trip[3].hotelResult.location_string;
        console.log(destination);
        var hotelName = trip[3].hotelResult.name;
        console.log(hotelName);
        var airport = trip[0].airport.IataCode;
        console.log(airport);
        setTripData(outAirline, inAirline, destination, airport, hotelName, price);
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
    const { values, handleChange, classes } = this.props;
    return (
      <div>
        <h1> Price for... </h1>
        { values.departureAirport.code } <br/>
        { values.departureDate.toDateString() } <br/>
        { values.returnDate.toDateString() } <br/>
        { (values.cheapest ? "cheapest\n" : "") } <br/>
        { (values.underBudget ? "under budget\n" : "") } <br/>
        { (values.farthest ? "farthest\n" : "") } <br/>
        { (values.withinUS ? "within u.s.\n" : "") } <br/>
        { (values.international ? "international\n" : "") } <br/>
        <p>{ values.totalPrice === null ? (values.apiErr === null? "Generating..." : values.apiErr) : (values.apiErr === null? values.totalPrice : values.apiErr) } </p>
      </div>
    );
  }
}
export default Price;