/** @class SavedTrip representing a saved trip*/
class SavedTrip {
  /**
  * Creates an instance of SavedTrip.
  *
  * @constructor
  * @param criteria {String} The quiz's answers
  * @param price {Int} The price of the trip
  */
  constructor(criteria, price) {
    this.criteria = criteria;
    this.price = price
  }
}

export default SavedTrip;