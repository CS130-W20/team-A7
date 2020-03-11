import unirest from "unirest";
import BookedTrip, { Flight, HotelStay } from '../../MyTrips/BookedTrips/BookedTrip.js';
import Criteria from '../../../models/Criteria';
import SavedTrip from '../../MyTrips/SavedTrips/SavedTrip';

function generateTrip(tripData, body, cbSuccess, cbError) {
  const url = "http://localhost:8080/generate-trip";
  unirest
    .post(url)
    .type("json")
    .send(body)
    .then(response => {
      console.log(response);
      if (response.code === 200) {
        const { outFlight, inFlight, inCarriers, hotel, numNights } = response.body;
      
        // Create BookedTrip object
        const departureDate = new Date(outFlight.OutboundLeg.DepartureDate);
        const departureAirline = outFlight.carriers.find(carr => carr.CarrierId == outFlight.OutboundLeg.CarrierIds[0]).Name;
        const outboundDepartureAirportCode = tripData.departureAirport.code;
        const outboundDepartureAirportName = tripData.departureAirport.name;
        const outboundDepartureCity = tripData.departureAirport.city;
        const outboundDestinationAirportCode = outFlight.airport.IataCode;
        const outboundDestinationAirportName = outFlight.airport.Name;
        const outboundDestinationCity = outFlight.airport.CityName;
        const departureFlight = new Flight(
          outboundDepartureCity,
          outboundDestinationCity,
          departureDate.toDateString(),
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
        
        const returnDate = new Date(inFlight.OutboundLeg.DepartureDate);
        const returnAirline = inCarriers.carriers.find(carr => carr.CarrierId == inFlight.OutboundLeg.CarrierIds[0]).Name;
        const inboundDepartureAirportName = outFlight.airport.Name;
        const inboundDepartureAirportCode = outFlight.airport.IataCode;
        const inboundDepartureCity = outFlight.airport.CityName;
        const inboundDestinationAirportCode = tripData.departureAirport.code;
        const inboundDestinationAirportName = tripData.departureAirport.name;
        const inboundDestinationCity = tripData.departureAirport.city;
        const returnFlight = new Flight(
          inboundDepartureCity,
          inboundDestinationCity,
          returnDate.toDateString(),
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

        const hotelStay = new HotelStay(hotel, numNights);
        const bookTrip = new BookedTrip('BookedTrip1', departureFlight, returnFlight, hotelStay);
        
        // Calculating total price
        const price = outFlight.MinPrice + inFlight.MinPrice + (hotel.price * numNights);

        // Creating the SavedTrip object
        const inputCriteria = new Criteria(
          tripData.departureAirport,
          tripData.departureDate.toDateString(),
          tripData.returnDate.toDateString(),
          tripData.destination,
          tripData.price,
          tripData.budget
        );
        const saveTrip = new SavedTrip(inputCriteria, price);

        cbSuccess({ bookTrip, saveTrip, hotelStay, price });
      } else {
        const { error } = response.body;
        cbError(error);
      }
    });
}

export default generateTrip;