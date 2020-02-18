import React from 'react';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = (margin) => {
  let root = {
    background: '#FFDD64',
    borderRadius: 10,
    color: 'white',
    height: 52,
    padding: '0px 22px',
    '&:hover': {
      backgroundColor: '#FFDD64'
    }
  };

  if (margin) {
    root.margin = margin;
  }

  return makeStyles({
    root: root,
    label: {
      fontSize: 18,
      fontWeight: 'bolder',
      fontFamily: 'Raleway'
    }
  });
};

const CTAButton = (props) => {
  const classes = useStyles(props.margin)();

  return (
    <Button
      classes={{
        root: classes.root,
        label: classes.label,
      }}
    >
      {props.children}
    </Button>
  )
}

export default CTAButton;