class Flight {
  constructor(departureCity, destinationCity, departureDate, departureAirline, departureAirport, destinationAirport) {
    this.departureCity = departureCity;
    this.destinationCity = destinationCity;
    this.departureDate = departureDate;
    this.departureAirline = departureAirline;
    this.departureAirport = departureAirport;
    this.destinationAirport = destinationAirport;
  }
}

class HotelStay {
  constructor(hotelResult, numNights) {
    this.hotelResult = hotelResult;
    this.numNights = numNights;
  }
}

class BookedTrip {
  constructor(name, departureFlight, returnFlight, hotelStay) {
    this.name = name;
    this.departureFlight = departureFlight;
    this.returnFlight = returnFlight;
    this.hotelStay = hotelStay;
  }
}

export {Flight, HotelStay};
export default BookedTrip;