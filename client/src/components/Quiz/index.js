import React, { Component } from 'react';
import DateFnsUtils from '@date-io/date-fns'; 

import {
  DatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {airports} from "./airport.js";

import { BrowserRouter as Router, Redirect, Route, Switch, Link, NavLink } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import Price from '../Price';

const ColoredLine = ({ color }) => (
  <hr
  style={{
    color: color,
    backgroundColor: color,
    height: 5
  }}
  />
  );

console.log("testing")

const styles = (theme) => ({
  smallTitle: {
    fontFamily: 'Indie Flower',
    fontSize: 42,
    color: 'black',
    textAlign: 'center',
    fontWeight: 'bold',
    margin: theme.spacing(9, 0, 0),
  },
  smallTitleForm: {
    fontSize: 26,
    color: 'black',
    textAlign: 'center',
    fontWeight: 'bold',
    margin: theme.spacing(8, 0, 0),
  },
  smallTitleForm2: {

    fontSize: 26,
    color: 'black',
    textAlign: 'center',
    fontWeight: 'bold',
    margin: theme.spacing(0, 0, 4),
  },
  option: {
    fontSize: 15,
    '& > span': {
      marginRight: 10,
      fontSize: 18,
    },
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),

  },
  form2: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
    textAlign: 'left',
    fontWeight: 'bold'
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },

});

const INITIAL_STATE = {
  departureAirport: null,
  departureDate: null,
  returnDate: null,
  cheapest: false,
  underBudget: false,
  farthest: false,
  withinUS: false,
  international: false,
  error: null,
};

class Quiz extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }
  
  onChange = (event, value) => {
    this.setState({ [event.target.name]: value });
  };

  handleAutocomplete = (airport) => {
    this.setState({
      departureAirport: airport
    });
  }

  handleDepartureDate = (date) => {
    if (this.state.returnDate !== null &&  this.state.departureDate >= date) {
      window.alert("Please enter a departure date before your return date :)");
    }
    else {
      this.setState({
        departureDate: date
      });
    }
  };

  handleReturnDate = (date) => {
    if (this.state.departureDate !== null && date <= this.state.departureDate) {
      window.alert("Please enter a return date after your departure date :)");
    }
    else {
      this.setState({
        returnDate: date
      });
    }
  };

  handleSubmit = () => {
    /*window.alert(
      "You input:\n" +
      this.state.departureAirport.code + '\n' +
      this.state.departureDate.toISOString() + '\n' +
      this.state.returnDate.toISOString() + '\n' + 
      (this.state.cheapest ? "cheapest\n" : "") +
      (this.state.underBudget ? "under budget\n" : "") +
      (this.state.farthest ? "farthest\n" : "") +
      (this.state.withinUS ? "within u.s.\n" : "") +
      (this.state.international ? "international\n" : ""))*/
    
    var departDate = this.state.departureDate.toISOString();
    departDate = departDate.slice(0,10);
    var returnDate = this.state.returnDate.toISOString();
    returnDate = returnDate.slice(0, 10);
    
    console.log(departDate);
    console.log(returnDate);
  }

  render() {
    const { classes } = this.props;
    
    const {
      departureAirport,
      departureDate,
      returnDate,
      cheapest,
      underBudget,
      farthest,
      withinUS,
      international,
      error,
    } = this.state;
    
    const isInvalid = 
      departureAirport === null ||
      departureDate === null ||
      returnDate === null;

    if (this.state.departureAirport) {
      console.log("departureAirport: " + this.state.departureAirport.code);
    }
    if (this.state.departureDate) {
      console.log("departureDate: " + this.state.departureDate);
    }
    if (this.state.returnDate) {
      console.log("returnDate: " + this.state.returnDate);
    }
    
    return (
      <Typography className={classes.smallTitle}>
        Give us a few details to help us generate your adventure
        <ColoredLine color="black" />
        <Container component="main" maxWidth="sm">
          <CssBaseline />
          <div className={classes.paper}>
            <form className={classes.form} noValidate>
              <Typography className={classes.smallTitleForm2}>
                What airport would you like to depart from and when do you want your trip to be?
              </Typography>
              <Autocomplete
                id="airport-select"
                value={departureAirport}
                onChange={(event, value) => this.handleAutocomplete(value)}
                style={{ width: 500, align: 'center'}}
                options={airports}
                classes={{
                  option: classes.option,
                }}
                autoHighlight
                getOptionLabel={option => option.name}
                renderOption={option => (
                  <React.Fragment>
                  {option.name} - {option.code} 
                  </React.Fragment>
                )}
                renderInput={params => (
                  <TextField
                    {...params}
                    label="Departure Airport"
                    variant="outlined"
                    fullWidth
                    inputProps={{
                      ...params.inputProps,
                      autoComplete: 'new-password', // disable autocomplete and autofill
                    }}
                  />

                )}
              />
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <DatePicker name="startDate" value={departureDate} onChange={(value) => this.handleDepartureDate(value)} label="Departure Date" margin="normal" />
                <DatePicker name="returnDate" value={returnDate} onChange={(value) => this.handleReturnDate(value)} label="Return Date" margin="normal" />
              </MuiPickersUtilsProvider>
              <Typography className={classes.smallTitleForm}>
                What kind of trip are you looking to have?     (check all that apply)
              </Typography>
              <Typography className={classes.form2}>
                Price:
              </Typography>
              <FormControlLabel
                control={<Checkbox name="cheapest" value={cheapest} onChange={(event, value) => this.onChange(event, value)} color="primary" />}
                label="Cheapest possible trip"
              />
              <FormControlLabel
                control={<Checkbox name="underBudget" value={underBudget} onChange={(event, value) => this.onChange(event, value)} color="primary" />}
                label="Just keep it under my budget"
              />
              <Typography className={classes.form2}>
                Location:
              </Typography>
              <FormControlLabel
                control={<Checkbox name="farthest" value={farthest} onChange={(event, value) => this.onChange(event, value)} color="primary" />}
                label="Farthest destination, take me away!"
              />
              <FormControlLabel
                control={<Checkbox name="withinUS" value={withinUS} onChange={(event, value) => this.onChange(event, value)} color="primary" />}
                label="I want to stay within the US"
              />
              <FormControlLabel
                control={<Checkbox name="international" value={international} onChange={(event, value) => this.onChange(event, value)} color="primary" />}
                label="International, Please!"
              />
              
              <Button
                type="submit"
                disabled={isInvalid}
                onClick={this.handleSubmit}
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                <Router>
                <NavLink to="/price" color="primary">Generate My Trip</NavLink>
                <Route exact path={ROUTES.PRICE} render={(props) => (<Price {...props} state={this.state}/>)}/>
                </Router>
              </Button>
              
            </form>
          </div>

        </Container>
      </Typography>
    );
  }
}

export default withStyles(styles)(Quiz);
