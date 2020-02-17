import React from 'react';
import { AppBar, Button, Toolbar, IconButton, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import logo from '../../assets/logo.png'

const styles = (theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  bar: {
    backgroundColor: '#000655'
  },
  logo: {
    marginTop: 17,
    marginBottom: 17,
    height: 50
  },
  button: {
    color: 'white'
  }
});

function NavBar({ classes }) {
  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.bar}>
        <Toolbar>
          <img src={logo} className={classes.logo}/>
          <Typography variant="h6" className={classes.title}>
            
          </Typography>
          <Button className={classes.button}>About</Button>
          <Button className={classes.button}>Login</Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default withStyles(styles)(NavBar);