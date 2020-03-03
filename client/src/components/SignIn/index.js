import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { compose } from 'recompose';

import { withStyles } from '@material-ui/core/styles';
import { withFirebase } from '../Firebase';
import {SignInFormBase, styles} from './SignInFormBase'
import * as ROUTES from '../../constants/routes';

const SignInPage = () => (
  <SignInForm />
);

const SignInLink = () => (
  <p>
    Already have an account? <Link to={ROUTES.SIGN_IN}>Sign In</Link>
  </p>
);

const SignInForm = compose(
  withRouter,
  withFirebase,
  withStyles(styles),
)(SignInFormBase);

export default SignInPage;
export { SignInForm, SignInLink };