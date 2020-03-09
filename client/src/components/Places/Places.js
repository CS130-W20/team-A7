import React, { Component } from 'react';

class Places {
  // This class definition is wrong but this is the general idea

  // Given the lat/long of hotel returns a JSON object w/ nearby points of interest
  async getPointsOfInterest(latitude, longitude) {
    var unirest = require("unirest");
    var proxyurl = "https://cors-anywhere.herokuapp.com/";
    return fetch(proxyurl + 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + latitude + ',' + longitude + '&radius=7500&type=tourist_attraction&key=' + process.env.REACT_APP_PLACES_API_KEY);
  }

  // Given the lat/long returns image information 
  getImage(lat, long) {
    return;
  }

};

export default Places;

/*
var testPlace = new Places();
testPlace.getPointsOfInterest(results[3].hotelResult.latitude, results[3].hotelResult.longitude).then(response => {
  response.json().then(places => {
    console.log(places.results);
  });
});
*/