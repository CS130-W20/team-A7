import { withStyles } from "@material-ui/core/styles";
import React from "react";
import { Link, withRouter } from "react-router-dom";
import { compose } from "recompose";
import * as ROUTES from "../../constants/routes";
import { withFirebase } from "../Firebase";
import { SignInFormBase, styles } from "./SignInFormBase";

const SignInPage = () => <SignInForm />;

const SignInLink = () => (
  <p>
    Already have an account? <Link to={ROUTES.SIGN_IN}>Sign In</Link>
  </p>
);

const SignInForm = compose(
  withRouter,
  withFirebase,
  withStyles(styles)
)(SignInFormBase);

export default SignInPage;
export { SignInForm, SignInLink };

