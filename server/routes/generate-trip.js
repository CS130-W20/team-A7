const express = require("express");
const fetch = require("node-fetch");
const router = express.Router();

const MAX_TRIES = 5;
const tripAdvisorRoutes = {
  PLACE: "/locations/search",
  HOTEL: "/hotels/list"
};

/**
 * Reconstructs a Date object from an ISO-formatted string.
 * 
 * @param {string} stringValue The ISO-formatted string to convert.
 * @return {Date} The Date equivalent to the passed in string.
 */
function dateReviver(stringValue) {
  return new Date(stringValue);
}

/**
 * Constructs a request to the SkyScanner API to find out what flights are available from a
 * given depature to a given destination
 * 
 * @param {string} departureCode The three-character departure airport code.
 * @param {string} destination The desired destination code (e.g. "FR" for "France").
 * @param {string} departureDate The ISO-formatted date portion (YYYY-MM-DD) representing the departure date.
 * @return {Promise} A promise wrapping the API-call that will resolve to a Response object on completion.
 */
function makeSkyScannerRequest(departureCode, destination, departureDate) {
  // Configure API request
  const flightUrl = "https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/US/USD/en-US/" + departureCode + "-sky/" + destination + "/" + departureDate;

  // Leaving this blank ensures we get a one-way flight. The API is crap and doesn't guarantee if it returns one-way or two-way flights so this is a precaution!
  const queryParams = new URLSearchParams({
    "inboundpartialdate": ""
  });
  const headers = {
    "x-rapidapi-host": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
    "x-rapidapi-key": "c0df19373bmshbec042d361c58f1p176ba3jsnb25321ccb0ab"
  };

  return fetch(flightUrl + "?" + queryParams, { headers });
}

/**
 * Constructs a request to the TripAdvisor API to either get the ID of a location or find
 * nearby hotels.
 * 
 * @param {string} route 
 * @param {Object} optionBag 
 */
function makeTripAdvisorRequest(route, optionBag) {
  const url = "https://tripadvisor1.p.rapidapi.com" + route;
  const { outFlight, placeId, numNights } = optionBag;
  
  let queryParams;
  switch (route) {
    case tripAdvisorRoutes.PLACE:
      queryParams = new URLSearchParams({
        "location_id" : "1",
        "limit": "5",
        "sort": "relevance",
        "offset": "0",
        "lang": "en_US",
        "currency": "USD",
        "units": "mi",
        "query": (outFlight.airport === null ? "Los Angeles" : outFlight.airport.CityName),
      });
      break;
    case tripAdvisorRoutes.HOTEL:
      const checkInDate = outFlight.OutboundLeg.DepartureDate.slice(0,10);

      queryParams = new URLSearchParams({
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
      break;
  }

  const headers = {
    "x-rapidapi-host": "tripadvisor1.p.rapidapi.com",
    "x-rapidapi-key": "c0df19373bmshbec042d361c58f1p176ba3jsnb25321ccb0ab"
  };

  return fetch(url + "?" + queryParams, { headers });
}

async function startOutFlight(tripData, retryIndex) {
  const { departureAirport, departDate, destination, price, budget } = tripData;
  let budgetLeft = (budget + 25) * 10;

  const internationalLocations = ["FR", "UK", "ES", "CA", "DK", "IT", "JP", "PL"];
  let internationalIndex = Math.floor(Math.random() * 8);

  let outDestination;
  switch (destination) {
    case "withinUS":
      outDestination = "US";
      break;
    case "international":
      outDestination = internationalLocations[internationalIndex];
      break;
    default:
      outDestination = "anywhere";
      break;
  }
  
  try {
    const res = await makeSkyScannerRequest(departureAirport.code, outDestination, departDate);
    const json = await res.json();

    let { Quotes: quotes, Carriers: carriers, Places: places } = json;
    let numResults = quotes.length;
    if (numResults == 0 || retryIndex > numResults - 1) {
      throw new Error("No results found. Please try new flight information.");
    }

    // Limit the possible values if there's a budget
    if (price === 'underBudget') {
      //reserve percentage of funds for outbound flight based on trip type. international more likely to be expensive.
      const outBudget = (destination === 'international') ? Math.floor(budgetLeft/3) : Math.floor(budgetLeft/4);
      const budgetQuotes = quotes.filter(q => (q.MinPrice <= outBudget));
      if (budgetQuotes.length == 0) {
        throw new Error("Budget is too small for current trip.");
      }
      
      quotes = budgetQuotes;
      numResults = budgetQuotes.length;
    }
    
    // Order the flights by price to make selection easier
    quotes.sort((a, b) => (a.MinPrice > b.MinPrice) ? 1 : -1);
    // Get the index of which entry we should use. 
    // If cheapest, take first entry because it's ordered by price.
    // If under budget, take last entry because we want the most bang for our buck of our allocated flight funds
    // If cost isn't a consideration, we'll take most expensive (last) entry.
    let tripIndex;
    switch (price) {
      case "cheapest":
        tripIndex = retryIndex;
        break;
      case "underBudget":
        tripIndex = numResults - 1 - retryIndex;
        break;
      default:
        tripIndex = Math.floor(Math.random() * numResults);
        break;
    }

    const chosenQuote = quotes[tripIndex];
    chosenQuote.carriers = carriers;

    airportPlace = places.find(element => element.PlaceId === chosenQuote.OutboundLeg.DestinationId);
    chosenQuote.airport = airportPlace;
    if (price === 'underBudget') {
      budgetLeft -= chosenQuote.MinPrice;
    }

    return { 
      outFlight: chosenQuote,
      budgetLeft
    };
  } catch(err) {
    throw err;
  }
}

async function startInFlight(tripData, outFlight, budgetLeft) {
  const { departureAirport, destination, price, returnDate } = tripData;
  const { airport } = outFlight;

  const inDeparture = airport.SkyscannerCode;

  try {
    const res = await makeSkyScannerRequest(inDeparture, departureAirport.code, returnDate);
    const json = await res.json();

    let inQuotes = json.Quotes;
    let numResults = inQuotes.length;
    if (numResults == 0) {
      throw new Error("No returning flights found. Trying a new trip.");
    }

    const inCarriers = { carriers: json.Carriers};
    // Sort by price once more
    inQuotes.sort((a, b) => (a.MinPrice > b.MinPrice) ? 1 : -1);
    
    if (price === "underBudget") {
      //reserve percentage of funds for inbound flight based on trip type and amount of funds left. international more likely to be expensive.
      // International: (2/3)/2 => 1/3 of original budget reserved for inbound flight
      // Otherwise: (3/4)/3 => 1/4 of original budget reserved for inbound flight 
      const inBudget = (destination === "international") ? Math.floor(budgetLeft/2) : Math.floor(budgetLeft/3);
      var budgetQuotes = inQuotes.filter(q => (q.MinPrice <= inBudget));
      if (budgetQuotes.length == 0) {
        throw new Error("Budget is too small for current trip.");
      }

      inQuotes = budgetQuotes;
      numResults = budgetQuotes.length;
    }
    
    //Get the index of which entry we should use. 
    // If cheapest, take first entry because it's ordered by price.
    // If under budget, take last entry because we want the most bang for our buck of our allocated flight funds
    // If cost isn't a consideration, we'll take most expensive (last) entry.
    const tripIndex = ((price === 'cheapest') ? 0 : numResults - 1 );
    const chosenQuote = inQuotes[tripIndex];
    if (price === 'underBudget') {
      budgetLeft -= chosenQuote.MinPrice;
    }
    return {
      inFlight: chosenQuote,
      inCarriers,
      budgetLeft
    }
  } catch(err) {
    throw err;
  }
}

async function startPlace(outFlight) {
  try {
    const res = await makeTripAdvisorRequest(tripAdvisorRoutes.PLACE, { outFlight });
    const json = await res.json();

    return json.data[0].result_object.location_id;
  } catch(err) {
    throw err;
  }
}

async function startHotel(tripData, outFlight, inFlight, placeId, budgetLeft) {
  const price = { tripData };
  const departDate = dateReviver(outFlight.OutboundLeg.DepartureDate);
  const returnDate = dateReviver(inFlight.OutboundLeg.DepartureDate);
  const numNights = (returnDate.getTime() - departDate.getTime())/(1000*3600*24);

  try {
    const res = await makeTripAdvisorRequest(tripAdvisorRoutes.HOTEL, { outFlight, placeId, numNights });
    const json = await res.json();

    let hotels = json.data;
    if (hotels === undefined) {
      throw new Error("Failed to fetch hotels.");
    }

    hotels = hotels.filter(hotel => ((hotel.hac_offers.availability == "available" || hotel.hac_offers.availability == "pending") && hotel.hasOwnProperty("price")));
    let numResults = hotels.length;
    if (numResults == 0) {
      throw new Error("No available hotels in the area we searched. Trying a new trip!");
    }

    const regex = /[0-9]+/;
    // Hotel price is represented as a range "$xx - $yy" or single "$zz", so we need to get the cheaper limit thru regex
    hotels.forEach((item, _) => {
      const price = item.price.match(regex);
      item.price = parseInt(price[0]);
    });

    hotels.sort((a, b) => (a.price > b.price) ? 1 : -1);
      
    if (price === 'underBudget') {
      // Spend the rest of the budget on a hotel!
      const nightlyBudget = budgetLeft / numNights;
      const budgetHotels = hotels.filter(hotel => (hotel.price <= nightlyBudget));
      if (budgetHotels.length == 0) {
        // We made it this far so we're giving them the cheapest hotel to try and stay near budget!
        numResults = 1;
      } else {
        hotels = budgetHotels;
        numResults = budgetHotels.length;
      }
    }
      
    // Same index selection logic as before. Give them the cheapest, otherwise the most expensive within their budget.
    const hotelIndex = ((price === 'cheapest') ? 0 : numResults - 1);
    const hotelResult = hotels[hotelIndex];
    return {
      hotel: hotelResult,
      numNights
    }
  } catch(err) {
    throw err;
  }
}

router.post("/", async (req, res) => {
  const { values } = req.body;
  
  let retryIndex;
  let error;
  for (retryIndex = 0; retryIndex < MAX_TRIES; retryIndex++) {
    try {
      const { outFlight, budgetLeft: budgetLeftOut } = await startOutFlight(values, retryIndex);
      const { inFlight, inCarriers, budgetLeft: budgetLeftIn } = await startInFlight(values, outFlight, budgetLeftOut);
      const placeId = await startPlace(outFlight);
      const { hotel, numNights } = await startHotel(values, outFlight, inFlight, placeId, budgetLeftIn);
  
      res.json({
        outFlight,
        inFlight,
        inCarriers,
        hotel,
        numNights
      });
      return;
    } catch(err) {
      console.log(err.toString());
      error = err;
    }
  }

  res.status(500).json({ error: error.toString()});
});

module.exports = router;