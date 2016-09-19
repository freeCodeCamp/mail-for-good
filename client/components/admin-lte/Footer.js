// Must have at least one test file in this directory or Mocha will throw an error.
import React from 'react';

const Footer = (props) => {
  return (
    <footer className="main-footer">
      <div className="pull-right hidden-xs">Anything you want</div>
      <span><strong>Copyright © 2016 <a href="#">Company</a>.</strong> All rights reserved.</span>
    </footer>
  )
};

export default Footer;
