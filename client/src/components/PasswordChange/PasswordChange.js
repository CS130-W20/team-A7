import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import { Redirect } from "react-router-dom";
import * as ROUTES from "../../constants/routes";

const styles = theme => ({
  card: {
    paddingBottom: 30,
    marginTop: 50,
    maxWidth: 500,
    margin: "auto",
    transition: "0.3s",
    boxShadow: "0 8px 40px -12px rgba(0,0,0,0.3)",
    "&:hover": {
      boxShadow: "0 16px 70px -12.125px rgba(0,0,0,0.3)"
    }
  },
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 3)
  },
  error: {
    color: "red",
    fontSize: "small",
    margin: theme.spacing(0, 0, 2)
  }
});

const INITIAL_STATE = {
  email: "",
  error: null
};

/** @class PasswordChange renders the page for changing a password. */
class PasswordChange extends Component {
  /**
  * Creates an instance of PasswordChange.
  *
  * @constructor
  * @param props {props} The react Component properties.
  */
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  /**
  * Overrides onSubmit functionality for button
  * @override
  * @param event {event} onSubmit event.
  * @return none
  */
  onSubmit = event => {
    event.preventDefault();
    this.props.resetPassword(this.state.email);
  };

  /**
  * Overrides onChange functionality for button
  * @override
  * @param event {event} onChange event.
  * @return none
  */
  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  /**
  * Renders the component
  *
  * @param none
  * @return HTML {HTML} The HTML representation of the component.
  */
  render() {
    const { email } = this.state;
    const { classes, error } = this.props;

    const isInvalid = email === "";

    if (error === "success") return <Redirect to={ROUTES.SIGN_IN}> </Redirect>;

    return (
      <div id="centered-fixed-masthead">
        <Card className={classes.card}>
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
              <Typography component="h1" variant="h5">
                Reset Password
              </Typography>
            </div>
            <Form className={classes.form} onSubmit={this.onSubmit}>
              <Form.Group controlId="formResetPassword">
                <Form.Control
                  name="email"
                  value={email}
                  onChange={this.onChange}
                  type="email"
                  placeholder="Email"
                />
              </Form.Group>
              {error && (
                <Typography className={classes.error}>
                  {error.message}
                </Typography>
              )}
              <Button
                disabled={isInvalid}
                type="submit"
                variant="primary"
                block
              >
                Reset
              </Button>
            </Form>
          </Container>
        </Card>
      </div>
    );
  }
}

export default withStyles(styles)(PasswordChange);
