import React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Card from '@material-ui/core/Card';
import { withStyles } from '@material-ui/core/styles';
import CTAButton from '../../CTAButton/CTAButton';

const styles = (theme) => ({
  card: {
    marginTop: 50,
    width: "60vw",
    minHeight: 250,
    margin: "auto",
    padding: 30,
    transition: "0.3s",
    boxShadow: "0 8px 40px -12px rgba(0,0,0,0.3)",
    "&:hover": {
      boxShadow: "0 16px 70px -12.125px rgba(0,0,0,0.3)"
    }
  },
  buttonContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50
  }
});

export default withStyles(styles)(function Payment(props) {
  const { nextStep, classes } = props;

  return (
    <div id="centered-fixed-masthead">
      <Card className={classes.card}>
        <Typography variant="h6" gutterBottom>
          Payment method
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField required id="cardName" label="Name on card" fullWidth />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField required id="cardNumber" label="Card number" fullWidth />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField required id="expDate" label="Expiry date" fullWidth />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              required
              id="cvv"
              label="CVV"
              helperText="Last three digits on signature strip"
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={<Checkbox color="secondary" name="saveCard" value="yes" />}
              label="Remember credit card details for next time"
            />
          </Grid>
        </Grid>
        <div className={classes.buttonContainer}>
          <CTAButton onClick={nextStep}>SUBMIT</CTAButton>
        </div>
      </Card>
    </div>
  );
});