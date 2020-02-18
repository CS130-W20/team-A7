import React from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';
import { Typography } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';

import './App.css';

import * as ROUTES from '../../constants/routes';

import Navigation from '../Navigation';
import NavBar from '../NavBar/NavBar';
import LandingPage from '../Landing';
import SignUpPage from '../SignUp';
import SignInPage from '../SignIn';
import PasswordForgetPage from '../PasswordForget';
import HomePage from '../Home';
import AccountPage from '../Account';
import AdminPage from '../Admin';

const theme = createMuiTheme({
  palette: {
    primary: { main: '#55A3FF' },
    secondary: { main: '#FFEEB1' }
  },
  typography: {
    fontFamily: 'Raleway, Arial'
  }
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div>
        <header>
          <NavBar/>
        </header>
      </div>
      <Router>
        <div>
          <hr />
          <Route exact path={ROUTES.LANDING} component={LandingPage} />
          <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
          <Route path={ROUTES.SIGN_IN} component={SignInPage} />
          <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage} />
          <Route path={ROUTES.HOME} component={HomePage} />
          <Route path={ROUTES.ACCOUNT} component={AccountPage} />
          <Route path={ROUTES.ADMIN} component={AdminPage} />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
