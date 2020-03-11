import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CTAButton from '../../CTAButton/CTAButton';
import * as ROUTES from '../../../constants/routes';

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
    width: '70vw',
    minHeight: 250,
    margin: 'auto',
    transition: '0.3s',
    boxShadow: '0 8px 40px -12px rgba(0,0,0,0.3)',
    '&:hover': {
      boxShadow: '0 16px 70px -12.125px rgba(0,0,0,0.3)'
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
  title: {
    fontFamily: 'Indie Flower',
    fontSize: 48,
    color: 'black',
    textAlign: 'center',
    fontWeight: 'bold',
    margin: 20,
  },
  subtitle: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 20
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 40
  },
  flightRouteContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: 40
  },
  buttonsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingLeft: 30,
    paddingRight: 30
  },
  bottomContainer: {
    padding: 40
  }
});

class ErrorCard extends Component {
  
  constructor(props) {
    super(props);
  }
  
  onClickRetakeQuiz = e => {
    const { setTotalPrice , setApiErr, goBack } = this.props;
    setTotalPrice(null);
    setApiErr(null);
    e.preventDefault();
    goBack();
  }
  
  render() {
    const { classes, values } = this.props;
 
    return (
      <div id="centered-fixed-masthead">
        <Card className={classes.card}>
          <div className={classes.paper}>
            <Typography className={classes.title}>
              Woops!
            </Typography>
            <Typography className={classes.subtitle}>
              We encountered an unexpected error generating your trip. Please try new parameters.
            </Typography>
          </div>
          <ColoredLine />
          <div className={classes.bottomContainer}>
            <div className={classes.buttonsContainer}>
              <Button label="retakeQuiz"
              type="submit"
              onClick={this.onClickRetakeQuiz}
              variant="contained">
                Retake Quiz
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }
}

export default withStyles(styles) (ErrorCard);