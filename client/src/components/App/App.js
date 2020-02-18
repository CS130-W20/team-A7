import React, { Component }from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { Typography } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';

import './App.css';

import * as ROUTES from '../../constants/routes';

import NavBar from '../NavBar/NavBar';
import SignIn from '../SignIn';
import SignUp from '../SignUp';
import About from '../About';
import Quiz from '../Quiz';
import MyTrips from '../MyTrips';

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
      <BrowserRouter>
          <NavBar />
          <Switch>
            <Route exact path={ROUTES.SIGN_UP} render={(props) => <SignUp {...props} />} />
            <Route exact path={ROUTES.SIGN_IN} render={(props) => <SignIn {...props} />}/>
            <Route exact path={ROUTES.QUIZ} render={(props) => <Quiz {...props} />}/>
            <Route exact path={ROUTES.MY_TRIPS} render={(props) => <MyTrips {...props} />}/>
            <Redirect to={ROUTES.ABOUT} render={(props) => <About {...props} />}/>
          </Switch>

      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
