import React, { useState } from 'react';
import DateFnsUtils from '@date-io/date-fns'; 
import { withStyles } from '@material-ui/core/styles';
import {
  DatePicker,
  TimePicker,
  DateTimePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {airports} from "./airport.js";


function countryToFlag(isoCode) {
  return typeof String.fromCodePoint !== 'undefined'
    ? isoCode.toUpperCase().replace(/./g, char => String.fromCodePoint(char.charCodeAt(0) + 127397))
    : isoCode;
}

const ColoredLine = ({ color }) => (
  <hr
      style={{
          color: color,
          backgroundColor: color,
          height: 5
      }}
  />
);

const useStyles = makeStyles(theme => ({
  smallTitle: {
    fontFamily: 'Indie Flower',
    fontSize: 42,
    color: 'black',
    textAlign: 'center',
    margin: theme.spacing(9, 0, 0),
  },
  smallTitleForm: {
    fontFamily: 'Indie Flower',
    fontSize: 30,
    color: 'black',
    textAlign: 'center',
    margin: theme.spacing(8, 0, 0),
  },
  smallTitleForm2: {
    fontFamily: 'Indie Flower',
    fontSize: 30,
    color: 'black',
    textAlign: 'center',
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

}));

const INITIAL_STATE = {
  departure_airport: '',
  departure_date: '',
  returnData: '',
  cheapest: false,
  underBudget: false,
  farthest: false,
  within_us: false,
  International: false,
  error: null,
};

export default function Quiz() {
  const classes = useStyles();
  const [selectedDate, handleDateChange] = useState(new Date());

  return (
    
    <Typography className={classes.smallTitle}>
    Give us a few details to help us gererate your adventure
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
            <DatePicker value={selectedDate} onChange={handleDateChange} label="Departure Date" margin="normal" />
            <DatePicker value={selectedDate} onChange={handleDateChange} label="Return Date" margin="normal" />
          </MuiPickersUtilsProvider>
          <Typography className={classes.smallTitleForm}>
             What kind of trip are you looking to have?     (check all that apply)
          </Typography>
          <Typography className={classes.form2}>
             Price:
          </Typography>
          <FormControlLabel
            control={<Checkbox value="cheapest" color="primary" />}
            label="Cheapest possible trip"
          />
          <FormControlLabel
            control={<Checkbox value="cheapest" color="primary" />}
            label="Just keep it under my budget"
          />

          <Typography className={classes.form2}>
             Location:
          </Typography>
          <FormControlLabel
            control={<Checkbox value="farthest" color="primary" />}
            label="Farthest destination, take me away!"
          />
          <FormControlLabel
            control={<Checkbox value="" color="primary" />}
            label="I want to stay within the US"
          />
          <FormControlLabel
            control={<Checkbox value="" color="primary" />}
            label="International, Please!"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Generate My Trip
          </Button>
         
        </form>
      </div>

    </Container>
    </Typography>
  );
}




