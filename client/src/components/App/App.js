import React from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';

import Navigation from '../Navigation';
import NavBar from '../NavBar/NavBar';
import Landing from '../Landing/Landing';

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
        <div id="page-container">
          <Landing/>
        </div>
      </div>
      <Router>
        <Navigation />
      </Router>
    </ThemeProvider>
  );
}

export default App;
