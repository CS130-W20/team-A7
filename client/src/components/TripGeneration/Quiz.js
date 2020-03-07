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
import FlatButton from 'material-ui/FlatButton';
import {airports} from "./airport.js";
import Card from '@material-ui/core/Card'

import { BrowserRouter as Router, Redirect, Route, Switch, Link, NavLink } from 'react-router-dom';
// import * as ROUTES from '../../constants/routes';
import Price from './Price';

const ColoredLine = ({ color }) => (
  <hr
    style={{
      //marginBottom: ,
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
    textAlign: 'left',
    fontWeight: 'bold'
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    marginBottom: 50,
  },

});

class Quiz extends Component {
  constructor(props) {
    super(props);
  }

  continue = e => {
    e.preventDefault();
    this.props.nextStep();
  };

  render() {
    const { values, handleChange, classes } = this.props;
    const isInvalid = 
      values.departureAirport === null ||
      values.departureDate === null ||
      values.returnDate === null;

    return (
      <div id="centered-flex-masthead">
      <Card className={classes.card}>
      <Typography className={classes.smallTitle}>
        Tell us About Your Trip
        <ColoredLine  />
        <Container component="main" maxWidth="sm">
          <CssBaseline />
          <div className={classes.paper}>
            <form className={classes.form} noValidate>
              <Typography className={classes.smallTitleForm2}>

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
                <DatePicker name="startDate" value={values.departureDate} onChange={(value) => handleChange("departureDate", value)} label="Departure Date" margin="normal" />
                <DatePicker name="returnDate" value={values.returnDate} onChange={(value) => handleChange("returnDate", value)} label="Return Date" margin="normal" />
              </MuiPickersUtilsProvider>
 
              <Typography className={classes.form2}>
                Price:
              </Typography>
              <FormControlLabel
                control={<Checkbox name="cheapest" value={values.cheapest} onChange={(event, value) => handleChange(event, value)} color="primary" />}
                label="Cheapest possible trip"
              />
              <FormControlLabel
                control={<Checkbox name="underBudget" value={values.underBudget} onChange={(event, value) => handleChange(event, value)} color="primary" />}
                label="Just keep it under my budget"
              />
              <Typography className={classes.form2}>
                Location:
              </Typography>
              <FormControlLabel
                control={<Checkbox name="farthest" value={values.farthest} onChange={(event, value) => handleChange(event, value)} color="primary" />}
                label="Farthest destination, take me away!"
              />
              <FormControlLabel
                control={<Checkbox name="withinUS" value={values.withinUS} onChange={(event, value) => handleChange(event, value)} color="primary" />}
                label="I want to stay within the US"
              />
              <FormControlLabel
                control={<Checkbox name="international" value={values.international} onChange={(event, value) => handleChange(event, value)} color="primary" />}
                label="International, Please!"
              />
              
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
