import React from 'react';
import { AppBar, Button, Toolbar, IconButton, Typography } from '@material-ui/core';
import { LinkContainer } from 'react-router-bootstrap'
import { Link } from 'react-router-dom'
import Image from 'react-bootstrap/Image'
import { withStyles } from '@material-ui/core/styles';
import logo from '../../assets/logo.png'

import { AuthUserContext } from '../Session';
import SignOutButton from '../SignOut';
import * as ROUTES from '../../constants/routes';

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

const NavBar = ({ classes }) => (
  <div>
    <AuthUserContext.Consumer>
      {authUser =>
        authUser ? 
        // User is authorized
        <div className={classes.root}>
        <AppBar position="static" className={classes.bar}>
          <Toolbar>
            <img src={logo} className={classes.logo}/>
          <Typography variant="h6" className={classes.title}>
    
          </Typography>
    
          <Button style={{color: "white"}}>Foo</Button>
    
          <Button style={{color: "white"}}>Bar</Button>
    
          <Button style={{color: "white"}}>Foo - Bar</Button>
    
          <LinkContainer to={ROUTES.QUIZ}>
            <Button className={classes.button}>Quiz</Button>
          </LinkContainer>
    
          <LinkContainer to={ROUTES.ABOUT}>
            <Button className={classes.button}>About</Button>
          </LinkContainer>
    
          <SignOutButton/>
    
          </Toolbar>
        </AppBar>
      </div> :
      // User not authorized
      <div className={classes.root}>
      <AppBar position="static" className={classes.bar}>
        <Toolbar>
        <Link to={ROUTES.LANDING}>
          <Image src={logo} className={classes.logo} />
        </Link>

        <Typography variant="h6" className={classes.title}>
        </Typography>
  
        <LinkContainer to={ROUTES.QUIZ}>
          <Button className={classes.button}>Quiz</Button>
        </LinkContainer>
  
        <LinkContainer to={ROUTES.ABOUT}>
          <Button className={classes.button}>About</Button>
        </LinkContainer>
            
        <LinkContainer to={ROUTES.SIGN_IN}>
          <Button className={classes.button}>Login</Button>
        </LinkContainer>
  
        </Toolbar>
      </AppBar>
    </div>
      }
    </AuthUserContext.Consumer>
  </div>
);

export default withStyles(styles)(NavBar);