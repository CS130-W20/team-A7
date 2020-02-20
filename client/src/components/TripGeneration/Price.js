import React, { Component } from 'react';

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
    const { values, handleChange, classes } = this.props;
    var totalPrice = 0;
    var tripDestination = "";
    var departDate = values.departureDate.toISOString();
    departDate = departDate.slice(0,10);
    var returnDate = values.returnDate.toISOString();
    returnDate = returnDate.slice(0, 10);
   
    
    function waitForApis() {
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

            var inter = outFlightReq.end(function (res) {
                if (res.error) throw new Error(res.error);
                //return resolve(res);
                var quotes = res.body.Quotes;
                var carriers = res.body.Carriers;
                
                var numResults = quotes.length;
                if (numResults == 0) {
                    this.setState({ error: "No results found. Please try new flight information." });
                }
                
                //Order the flights by price
                quotes.sort((a, b) => (a.MinPrice > b.MinPrice) ? 1 : -1);
        
                //Get the index of which entry we should use. If cheapest selected take the first entry b/c it's ordered.
                var randomIndex = values.cheapest ? 0 : Math.floor(Math.random() * numResults);
                var chosenQuote = quotes[randomIndex];
                console.log(chosenQuote);
                console.log(res.body.Places);
                totalPrice += chosenQuote.MinPrice;
                
                var place = res.body.Places.find(element => element.PlaceId == chosenQuote.OutboundLeg.DestinationId);
                console.log(place);
                
                var inDeparture = place.SkyscannerCode;
                tripDestination = place.CityName;
                console.log(tripDestination);
                
                var inFlightUrl = "https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/US/USD/en-US/" + inDeparture + "-sky/" + values.departureAirport.code + "-sky/" + returnDate;
                console.log(inFlightUrl);
                
                var inFlightReq = unirest("GET", inFlightUrl);
                inFlightReq.query({
                    "inboundpartialdate": ""
                });
                
                inFlightReq.headers({
                    "x-rapidapi-host": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
                    "x-rapidapi-key": "c0df19373bmshbec042d361c58f1p176ba3jsnb25321ccb0ab"
                });
                
                inFlightReq.end(function (inRes) {
                    if (inRes.error) throw new Error(inRes.error);
                    
                    var inQuotes = inRes.body.Quotes;
                    var inCarriers = inRes.body.Carriers;
                    console.log(inCarriers);
                    inQuotes.sort((a, b) => (a.MinPrice > b.MinPrice) ? 1 : -1);
                    var chosenInQuote = quotes[0];
                    console.log(chosenInQuote);
                    totalPrice += chosenInQuote.MinPrice;
                    resolve(totalPrice);
                });
            });
            
        })
    }
    
    waitForApis().then(res => {
        
        this.setState({ totalPrice : res })
        //console.log(res.body.Places);
        
        //return totalPrice;
    });
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
        { this.state.totalPrice === null ? "Generating..." : this.state.totalPrice } <br/>
      </div>
    );
  }
}
export default Price;