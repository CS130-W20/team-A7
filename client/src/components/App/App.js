import React from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import './App.css';

import NavBar from '../NavBar/NavBar';
import Landing from '../Landing/Landing';
import SignIn from '../SignIn';
import SignUp from '../SignUp';
import About from '../About';
import TripGeneration from '../TripGeneration/TripGeneration';
import MyTrips from '../MyTrips';

import * as ROUTES from '../../constants/routes';
import { withAuthentication } from '../Session';
import PasswordChange from '../PasswordChange';

const theme = createMuiTheme({
  palette: {
    primary: { main: '#55A3FF' },
    secondary: { main: '#FFEEB1' }
  },
  typography: {
    fontFamily: 'Raleway, Arial'
  }
});

function App() {
  return (
    <div id="root-div">
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <header id="header">
          <NavBar/>
        </header>
        <Switch>
            <Route exact path={ROUTES.LANDING} render={(props) => <Landing {...props} />} />
            <Route exact path={ROUTES.ABOUT} render={(props) => <About {...props} />} />
            <Route exact path={ROUTES.SIGN_UP} render={(props) => <SignUp {...props} />} />
            <Route exact path={ROUTES.PASSWORD_FORGET} render={(props) => <PasswordChange {...props} />} />
            <Route exact path={ROUTES.SIGN_IN} render={(props) => <SignIn {...props} />}/>
            <Route exact path={ROUTES.MY_TRIPS} render={(props) => <MyTrips {...props} />}/>
            <Route exact path={ROUTES.QUIZ} render={(props) => < TripGeneration {...props} />}/>
            <Redirect to={ROUTES.LANDING} render={(props) => <Landing {...props} />}/>
        </Switch>
      </BrowserRouter>
    </ThemeProvider>
    </div>
  );
}

export default withAuthentication(App);
