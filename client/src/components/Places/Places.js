
// Returns a JSON object w/ nearby points of interest given a latitude and longitude
export const getPointsOfInterest = async (latitude, longitude) => {
    var proxyurl = "https://cors-anywhere.herokuapp.com/";
    return fetch(proxyurl + 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + latitude + ',' + longitude + '&radius=7500&type=tourist_attraction&key=' + process.env.REACT_APP_PLACES_API_KEY); 
};

// Returns an image given the photo reference
export const getImage = async (photoReference) => {
    var proxyurl = "https://cors-anywhere.herokuapp.com/";
    return fetch(proxyurl + 'https://maps.googleapis.com/maps/api/place/photo?photoreference=' + photoReference + '&key=' + process.env.REACT_APP_PLACES_API_KEY + '&maxheight=250'); 
};

// Returns a city image given the city name
export const getCityImage = async (cityName) => {
    var proxyurl = "https://cors-anywhere.herokuapp.com/";
    var apiKey = process.env.REACT_APP_PLACES_API_KEY;
    // Search using Google Places Search with cityName
    fetch(proxyurl + 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json?key=' + apiKey + '&input=' + cityName + '&inputtype=textquery').then((response) => {
        var response_temp = response.json()
        console.log(response_temp)
        return response_temp; // need to extract the place ID from JSON for use w/ Places Details API
    }).then((placeId) => {
        fetch(proxyurl + 'https://maps.googleapis.com/maps/api/place/details/json?key=' + apiKey + '&place_id=' + placeId).then((response) => {
            return response.json(); // Need to extract photorreference from this fetch
        }).then((photoReference) => {
            // This actually returns the image
            return fetch(proxyurl + 'https://maps.googleapis.com/maps/api/place/photo?photoreference=' + photoReference + '&key=' + apiKey + '&maxheight=250');
        })
    })
};
