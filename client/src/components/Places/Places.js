
/**
  * gets the attractions for a given city.
  * 
  * @param cityName {String} Name of the city to be queried.
  * @return Promise {Promise} Promise that eventually returns the attractions for a city.
  */
export const getAttractions = async (cityName) => {
  var proxyurl = "https://salty-gorge-09496.herokuapp.com/";
  var apiKey = process.env.REACT_APP_PLACES_API_KEY;

  return new Promise(function (resolve, reject) {
    try {
      fetch(proxyurl + 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json?key=' + apiKey + '&input=' + cityName + '&inputtype=textquery').then((response) => {
        // Finds the placeId based on the name of destination
        return response.json()
      }).then((response) => {
        var placeId = response.candidates[0].place_id;
        fetch(proxyurl + 'https://maps.googleapis.com/maps/api/place/details/json?key=' + apiKey + '&place_id=' + placeId).then((response) => {
          // Uses the placeId to get more information on place
          return response.json();
        }).then((response) => {
          var latitude = response.result.geometry.location.lat
          var longitude = response.result.geometry.location.lng
          fetch(proxyurl + 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + latitude + ',' + longitude + '&radius=7500&type=tourist_attraction&key=' + apiKey).then((response) => {
            // Returns a list of attractions?
            return response.json();
          }).then((response) => {
            resolve(response.results.slice(0, 3))
          })
        })
      });  
    } catch (e) {
      reject(e)
    }
  });
};

/**
  * gets the image for a given city.
  * 
  * @param cityName {String} Name of the city to be queried.
  * @return Promise {Promise} Promise that eventually returns the image for a city.
  */
export const getCityImage = async (cityName) => {
    var proxyurl = "https://salty-gorge-09496.herokuapp.com/";
    var apiKey = process.env.REACT_APP_PLACES_API_KEY;
    // Search using Google Places Search with cityName
    return new Promise(function (resolve, reject) {
      try {
        fetch(proxyurl + 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json?key=' + apiKey + '&input=' + cityName + '&inputtype=textquery').then((response) => {
          // Finds the placeId based on the name of destination
          return response.json()
        }).then((response) => {
          var placeId = response.candidates[0].place_id;
          fetch(proxyurl + 'https://maps.googleapis.com/maps/api/place/details/json?key=' + apiKey + '&place_id=' + placeId).then((response) => {
              // Uses the placeId to get more information on place
              return response.json();
          }).then((response) => {
            // Extracts the photoreference of the result and returns the url
            var photoReference = response.result.photos[0].photo_reference;
            resolve('https://maps.googleapis.com/maps/api/place/photo?photoreference=' + photoReference + '&key=' + apiKey + '&maxheight=250');
          })
        });  
      } catch (e) {
        reject(e)
      }
    });
    //
};

/**
  * gets the formatted city name. City, State, Country.
  * 
  * @param cityName {String} Name of the city to be queried.
  * @return Promise {Promise} Promise that eventually returns the formatted city name.
  */
export const getFormattedAddress = async (cityName) => {
  var proxyurl = "https://salty-gorge-09496.herokuapp.com/";
  var apiKey = process.env.REACT_APP_PLACES_API_KEY;
  // Search using Google Places Search with cityName
  return new Promise(function (resolve, reject) {
    try {
      fetch(proxyurl + 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json?key=' + apiKey + '&input=' + cityName + '&inputtype=textquery').then((response) => {
        // Finds the placeId based on the name of destination
        return response.json()
      }).then((response) => {
        var placeId = response.candidates[0].place_id;
        fetch(proxyurl + 'https://maps.googleapis.com/maps/api/place/details/json?key=' + apiKey + '&place_id=' + placeId).then((response) => {
            // Uses the placeId to get more information on place
            return response.json();
        }).then((response) => {
          resolve(response.result.formatted_address);
        })
      })
    } catch (e) {
      reject(e)
    }
  });
};

/**
  * gets the city's website url.
  * 
  * @param cityName {String} Name of the city to be queried.
  * @return Promise {Promise} Promise that eventually returns the city website url.
  */
export const getCityWebsite = async (cityName) => {
  var proxyurl = "https://salty-gorge-09496.herokuapp.com/";
  var apiKey = process.env.REACT_APP_PLACES_API_KEY;
  // Search using Google Places Search with cityName

  return new Promise(function (resolve, reject) {
    try {
      fetch(proxyurl + 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json?key=' + apiKey + '&input=' + cityName + '&inputtype=textquery').then((response) => {
        // Finds the placeId based on the name of destination
        return response.json()
      }).then((response) => {
        var placeId = response.candidates[0].place_id;
        fetch(proxyurl + 'https://maps.googleapis.com/maps/api/place/details/json?key=' + apiKey + '&place_id=' + placeId).then((response) => {
            // Uses the placeId to get more information on place
            return response.json();
        }).then((response) => {
          resolve(response.result.website);
        })
      })
    } catch (e) {
      reject(e)
    }
  });
};

