/** @class Flight representing data from Skyscanner */
class Flight {
  /**
  * Creates an instance of Flight.
  *
  * @constructor
  * @param departureCity {String} The departure city
  * @param destinationCity {String} The destination city
  * @param departureDate {String} The departure date
  * @param departureAirline {String} The departure airline
  * @param departureAirport {String} The departure airport
  * @param destinationAirport {String} The destination airport
  */
  constructor(departureCity, destinationCity, departureDate, departureAirline, departureAirport, destinationAirport) {
    this.departureCity = departureCity;
    this.destinationCity = destinationCity;
    this.departureDate = departureDate;
    this.departureAirline = departureAirline;
    this.departureAirport = departureAirport;
    this.destinationAirport = destinationAirport;
  }
}

/** @class HotelStay representing data from TripAdvisor */
class HotelStay {
  /**
  * Creates an instance of HotelStay.
  *
  * @constructor
  * @param hotelResult {JSON} The packaged tripadvisor data
  * @param numNights {Int} The number of nights
  */
  constructor(hotelResult, numNights) {
    this.hotelResult = hotelResult;
    this.numNights = numNights;
  }
}

/** @class BookedTrip representing data from Skyscanner */
class BookedTrip {
  /**
  * Creates an instance of BookedTrip.
  *
  * @constructor
  * @param name {String} The name of the trip
  * @param departureFlight {String} The departure Flight object
  * @param returnFlight {String} The return Flight object
  * @param hotelStay {String} The HotelStay object
  * @param price {String} The price of the trip
  */
  constructor(name, departureFlight, returnFlight, hotelStay, price) {
    this.name = name;
    this.departureFlight = departureFlight;
    this.returnFlight = returnFlight;
    this.hotelStay = hotelStay;
    this.price = price;
  }
}

export {Flight, HotelStay};
export default BookedTrip;