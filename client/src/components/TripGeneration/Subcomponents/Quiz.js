import DateFnsUtils from '@date-io/date-fns';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Autocomplete from '@material-ui/lab/Autocomplete';

import Grid from '@material-ui/core/Grid';
import { addDays } from 'date-fns';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Slider from '@material-ui/core/Slider';

// import { BrowserRouter as Router, Redirect, Route, Switch, Link, NavLink } from 'react-router-dom';
// import * as ROUTES from '../../constants/routes';
// import Price from './Price';

import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import React, { Component } from 'react';
import { airports } from "../../../constants/airport.js";

const ColoredLine = ({ color }) => (
  <hr
    style={{
      color: color,
      backgroundColor: color,
      height: 1
    }}
  />
);

const styles = (theme) => ({
  card: {
    marginTop: 50,
    marginBottom: 50,
    maxWidth: 1000,
    margin: "auto",
    transition: "0.3s",
    boxShadow: "0 8px 40px -12px rgba(0,0,0,0.3)",
    "&:hover": {
      boxShadow: "0 16px 70px -12.125px rgba(0,0,0,0.3)"
    }
  },
  smallTitle: {
    fontFamily: 'Indie Flower',
    fontSize: 62,
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
    marginTop: theme.spacing(3),
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
    marginBottom: theme.spacing(2),
    textAlign: 'left',
    fontWeight: 'bold'
  },
  form3: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(2),
    textAlign: 'left',
    fontWeight: 'bold'
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    marginBottom: 50,
  },

});

const marks = [
  {
    value: 0,
    label: '$250',
  },

  {
    value: 25,
    label: '$500',
  },
  {
    value: 50,
    label: '$750',
  },
  {
    value: 75,
    label: '$1000',
  },
  {
    value: 100,
    label: '$1250',
  },
];

/** @class Price handles quiz processing */
class Quiz extends Component {
  /**
  * Creates an instance of Quiz.
  *
  * @constructor
  * @param props {props} The React Component properties.
  */
  constructor(props) {
    super(props);
    this.slider_value = 0;
  }

  continue = e => {
    e.preventDefault();
    this.props.nextStep();
  };

  /**
  * Renders the component
  *
  * @param none
  * @return HTML {HTML} The HTML representation of the component.
  */
  render() {
    const { values, handleChange, handleSliderChange, classes } = this.props; 

    function valuetext(value) {
      // console.log(value)
      return `${value}`;
    }

    const isInvalid = 
      values.departureAirport === null ||
      values.departureDate === null ||
      values.returnDate === null;

    return (
      <div id="centered-flex-masthead">
      <Card className={classes.card}>
      <Typography className={classes.smallTitle} component={'div'}>
        Tell us About Your Trip
        <ColoredLine  />
        <Container component="main" maxWidth="sm">
          <CssBaseline />
          <div className={classes.paper}>
            <form className={classes.form} noValidate>
            <Typography className={classes.form2} component={'div'}>
                The Basics:
              </Typography>
              <Autocomplete
                id="airport-select"
                value={values.departureAirport}
                onChange={(event, value) => handleChange("autocomplete", value)}
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
              <Grid container justify="space-around">
                <DatePicker name="startDate" value={values.departureDate} onChange={(value) => handleChange("departureDate", value)} label="Departure Date" margin="normal" minDate={addDays(new Date(), 1)} />
                <DatePicker name="returnDate" value={values.returnDate} onChange={(value) => handleChange("returnDate", value)} label="Return Date" margin="normal" minDate={addDays(new Date(), 1)} />
                </Grid>
              </MuiPickersUtilsProvider>
 
              <Typography className={classes.form3} component={'div'}>
                Price (Choose one):
              </Typography>
              
              <RadioGroup aria-label="price" name="price"  defaultValue= "anyPrice" value={values.price} onChange={(event, value) => handleChange(event, value)}>
                <FormControlLabel value="anyPrice" control={<Radio />} label="Cost isn't a factor" />
                <FormControlLabel value="cheapest" control={<Radio />} label="Cheapest possible random trip" />
                <FormControlLabel value="underBudget" control={<Radio />} label="Just keep it within my budget" />
              </RadioGroup>


              <div hidden={values.price !== 'underBudget'}>
                <Typography className={classes.form3} component={'div'}>
                  Budget:
                </Typography>

                <Slider
                  value={values.budget}
                  getAriaValueText={valuetext}
                  aria-labelledby="discrete-slider-custom"
                  onChange={(event, value) => handleSliderChange(value)}
                  step={25}
                  valueLabelDisplay="off"
                  marks={marks}
                />
              </div>

              <Typography className={classes.form3} component={'div'}>
                Location (Choose One):
              </Typography>

              <RadioGroup aria-label="withinUS" name="destination"  defaultValue= "anyDest" value={values.destination} onChange={(event, value) => handleChange(event, value)}>
                <FormControlLabel value="anyDest" control={<Radio />} label="Suprise me!" />
                <FormControlLabel value="withinUS" control={<Radio />} label="Keep it within the U.S." />
                <FormControlLabel value="international" control={<Radio />} label="International" />
              </RadioGroup>


              
              <Button label="submit"
              type="submit"
              disabled={isInvalid}
              onClick={this.continue}
              fullWidth
              variant="contained">
                Submit
              </Button>
            </form>
          </div>

        </Container>
      </Typography>
      </Card>
      </div>
    );
  }
}

export default withStyles(styles)(Quiz);
