
class Places {

    // Given the lat/long of hotel returns a JSON object w/ nearby points of interest
    async getPointsOfInterest(latitude, longitude) {
        var unirest = require("unirest");
        var proxyurl = "https://cors-anywhere.herokuapp.com/";
        return fetch(proxyurl + 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + latitude + ',' + longitude + '&radius=7500&type=tourist_attraction&key=' + process.env.REACT_APP_PLACES_API_KEY); 
    }

    // Given the lat/long returns image information 
    async getImage(photoReference) {
        var unirest = require("unirest");
        var proxyurl = "https://cors-anywhere.herokuapp.com/";
        return fetch(proxyurl + 'https://maps.googleapis.com/maps/api/place/photo?photoreference=' + photoReference + '&key=' + process.env.REACT_APP_PLACES_API_KEY + '&maxheight=250'); 
    }

    async getCityImage(cityName) {
        var unirest = require("unirest");
        var proxyurl = "https://cors-anywhere.herokuapp.com/";
        // Search using Google Places Search with cityName
        fetch(proxyurl + 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json?key=' + process.env.REACT_APP_PLACES_API_KEY + '&input=' + cityName + '&inputtype=textquery').then((response) => {
            return response.json(); // need to extract the place ID from JSON for use w/ Places Details API
        }).then((placeId) => {
            fetch(proxyurl + 'https://maps.googleapis.com/maps/api/place/details/json?key=' + process.env.REACT_APP_PLACES_API_KEY + '&place_id=' + placeId).then((response) => {
                return response.json(); // Need to extract photorreference from this fetch
            }).then((photoReference) => {
                // This actually returns the image
                return fetch(proxyurl + 'https://maps.googleapis.com/maps/api/place/photo?photoreference=' + photoReference + '&key=' + process.env.REACT_APP_PLACES_API_KEY + '&maxheight=250');
            })
        })
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