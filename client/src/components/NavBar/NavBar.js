import React from 'react';
import { AppBar, Button, Toolbar, IconButton, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import logo from '../../assets/logo.png'

const styles = () => ({
  bar: {
    backgroundColor: "#000655"
  },
  logo: {
    marginTop: 17,
    marginBottom: 17,
    height: 50
  },
});

function NavBar({ classes }) {
  return (
    <AppBar position="static" className={classes.bar}>
      <Toolbar>
        <img src={logo} className={classes.logo}/>
      </Toolbar>
    </AppBar>
  );
}

export default withStyles(styles)(NavBar);