class Flight {
  constructor(departureCity, destinationCity, departureDate, returnDate, departureAirport, returnAirport) {
    this.departureCity = departureCity;
    this.destinationCity = destinationCity;
    this.departureDate = departureDate;
    this.returnDate = returnDate;
    this.departureAirport = departureAirport;
    this.returnAirport = returnAirport;
  }
}

class HotelStay {
  constructor(placeId, checkIn, checkOut) {
    this.placeId = placeId;
    this.checkIn = checkIn;
    this.checkOut = checkOut;
  }
}

class Trip {
  constructor(name, destinationFlight, returnFlight, hotelStay) {
    this.name = name;
    this.destinationFlight = destinationFlight;
    this.returnFlight = returnFlight;
    this.hotelStay = hotelStay;
  }
}

export {Flight, HotelStay};
export default Trip;