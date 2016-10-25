import React, { PropTypes } from 'react';

const Header = (props) => { // eslint-disable-line no-unused-vars
  const { user } = props;
  return (
    <header className="main-header">
      <a className="logo">
        <span className="logo-mini">
          <strong>E</strong>S</span>
        <span className="logo-lg">
          <strong>Email</strong>Service</span>
      </a>
      <nav className="navbar navbar-static-top">
        <a className="sidebar-toggle" href="#" data-toggle="offcanvas">
          <span className="sr-only">Toggle navigation</span>
        </a>
        <div className="navbar-custom-menu">
          <ul className="nav navbar-nav">

          <li className="dropdown notifications-menu">
            <a href="#" className="dropdown-toggle" data-toggle="dropdown">
              <i className="fa fa-bell-o" />
              <span className="label label-warning">1</span>
            </a>
            <ul className="dropdown-menu">
              <li className="header">You have 1 notifications</li>
              <li>
                <div className="slimScrollDiv" style={{ position: 'relative', overflow: 'hidden', width: 'auto', height: '200px' }}><ul className="menu" style={{ overflow: 'hidden', width: '100%', height: '200px' }}>

                  <li>
                    <a href="#">
                      <i className="fa fa-users text-red" /> Example
                    </a>
                  </li>

                </ul><div className="slimScrollBar" style={{ 'background': 'rgb(0, 0, 0) none repeat scroll 0% 0%', 'width': '3px', 'position': 'absolute', 'top': '0px', 'opacity': '0.4', 'display': 'block', 'borderRadius': '7px', 'zIndex': '99', 'right': '1px' }} />
                <div className="slimScrollRail" style={{ 'width': '3px', 'height': '100%', 'position': 'absolute', 'top': '0px', 'display': 'none', 'borderRadius': '7px', 'background': 'rgb(51, 51, 51) none repeat scroll 0% 0%', 'opacity': '0.2', 'zIndex': '90', 'right': '1px'}} />
                </div>
              </li>
              <li className="footer"><a href="#">View all</a></li>
            </ul>
          </li>

            <li className="dropdown user user-menu">
              <a className="dropdown-toggle" href="#" data-toggle="dropdown">
                <img className="user-image" src={user.picture} alt="User Image"/>
                <span className="hidden-xs">{user.email}</span>
              </a>
              <ul className="dropdown-menu">
                <li className="user-header">
                  <img className="img-circle" src={user.picture} alt="User Image"/>
                  <p>{user.name}</p>
                  <p>{user.email}</p>
                </li>
                <li className="user-footer">
                  <div className="pull-right">
                    <a className="btn btn-default btn-flat" href="/logout">Sign out</a>
                  </div>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

Header.propTypes = {
  user: PropTypes.object
};

export default Header;
