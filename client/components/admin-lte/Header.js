// Must have at least one test file in this directory or Mocha will throw an error.
import React from 'react';

const Header = (props) => {
  return (
    <header className="main-header">
        <a className="logo" href="index2.html"> <span className="logo-mini"><strong>A</strong>LT</span> <span className="logo-lg"><strong>Admin</strong>LTE</span> </a>
        <nav className="navbar navbar-static-top">
            <a className="sidebar-toggle" href="#" data-toggle="offcanvas"> <span className="sr-only">Toggle navigation</span> </a>
            <div className="navbar-custom-menu">
                <ul className="nav navbar-nav">
                    <li className="dropdown user user-menu">
                        <a className="dropdown-toggle" href="#" data-toggle="dropdown"> <img className="user-image" src="dist/img/user2-160x160.jpg" alt="User Image" /> <span className="hidden-xs">Alexander Pierce</span> </a>
                        <ul className="dropdown-menu">
                            <li className="user-header"><img className="img-circle" src="dist/img/user2-160x160.jpg" alt="User Image" />
                                <p>Alexander Pierce - Web Developer <small>Member since Nov. 2012</small></p>
                            </li>
                            <li className="user-footer">
                                <div className="pull-left"><a className="btn btn-default btn-flat" href="#">Profile</a></div>
                                <div className="pull-right"><a className="btn btn-default btn-flat" href="#">Sign out</a></div>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </nav>
    </header>
  )
};

export default Header;
