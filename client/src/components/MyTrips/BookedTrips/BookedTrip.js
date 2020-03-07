class Flight {
  constructor(departureCity, destinationCity, departureDate, departureAirport, destinationAirport) {
    this.departureCity = departureCity;
    this.destinationCity = destinationCity;
    this.departureDate = departureDate;
    this.departureAirport = departureAirport;
    this.destinationAirport = destinationAirport;
  }
}

class HotelStay {
  constructor(placeId, checkIn, checkOut) {
    this.placeId = placeId;
    this.checkIn = checkIn;
    this.checkOut = checkOut;
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