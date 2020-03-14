import React, { Component } from 'react';
import Card from '@material-ui/core/Card'
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';

const styles = (theme) => ({
  card: {
    marginTop: 50,
    width: 500,
    minHeight: 250,
    margin: "auto",
    transition: "0.3s",
    boxShadow: "0 8px 40px -12px rgba(0,0,0,0.3)",
    "&:hover": {
      boxShadow: "0 16px 70px -12.125px rgba(0,0,0,0.3)"
    }
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  circle: {
    marginTop: 30
  }
});

/** @class GeneratedCard renders the "generating" screen after submitting a Quiz */
class GeneratingCard extends Component {
  /**
  * Renders the component
  *
  * @param none
  * @return HTML {HTML} The HTML representation of the component.
  */
  render() {
    const { classes } = this.props;

    return (
      <div id="centered-fixed-masthead">
        <Card className={classes.card}>
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
              <Typography component="h1" variant="h5">
                Generating...
              </Typography>
            </div>
          </Container>
          <div className={classes.item}>
            <CircularProgress className={classes.circle}/>
          </div>
        </Card>
      </div>
    );
  }
}

  export default withStyles(styles)(GeneratingCard);