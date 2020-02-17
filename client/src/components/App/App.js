import React from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import background from '../../assets/background.png';

import Navigation from '../Navigation';

import NavBar from '../NavBar/NavBar';

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
    <ThemeProvider theme={theme}>
      <div id="root-div">
        <header id="header">
          <NavBar/>
        </header>
        <div id="content-container">
          <img src={background} id="background"/>
          <div id="title-container">
          </div>
        </div>
      </div>
      <Router>
        <Navigation />
      </Router>
    </ThemeProvider>
  );
}

export default App;
