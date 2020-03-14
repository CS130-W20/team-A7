import { withStyles } from "@material-ui/core/styles";
import React from "react";
import { Link, withRouter } from "react-router-dom";
import { compose } from "recompose";
import * as ROUTES from "../../constants/routes";
import { withFirebase } from "../Firebase";
import { SignUpFormBase, styles } from "./SignUpFormBase";

const SignUpPage = () => <SignUpForm />;

const SignUpLink = () => (
  <p>
    Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
  </p>
);

const SignUpForm = compose(
  withRouter,
  withFirebase,
  withStyles(styles)
)(SignUpFormBase);

export default SignUpPage;
export { SignUpForm, SignUpLink };