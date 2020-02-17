import React from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { BrowserRouter as Router } from 'react-router-dom';
import { Typography } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';

import './App.css';

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
        <Navigation />
      </Router>
    </ThemeProvider>
  );
}

export default App;
