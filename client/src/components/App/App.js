import React from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Typography } from '@material-ui/core';
import './App.css';

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
    </ThemeProvider>
  );
}

export default App;
