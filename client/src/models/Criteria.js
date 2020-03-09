class Criteria {
  constructor(departureAirport, departureDate, returnDate, cheapest, underBudget, budget, withinUs, international) {
    this.departureAirport = departureAirport;
    this.departureDate = departureDate;
    this.returnDate = returnDate;
    this.cheapest = cheapest;
    this.underBudget = underBudget;
    this.budget = budget;
    this.withinUs = withinUs;
    this.international = international;
  }
}

export default Criteria;