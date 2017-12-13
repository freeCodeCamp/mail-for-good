import React, { PropTypes } from 'react';
import WSNotification from './WS-Notification';

import '../../styles/header.scss';

const Header = props => { // eslint-disable-line no-unused-vars
  const { user, ws_notification, consumeNotification } = props;
  return (
    <header className="main-header">
      <div className="logo">
        <span className="logo-mini">
          <strong>MfG</strong>
        </span>
        <span className="logo-lg">
          <strong>Mail for Good <i className="fa fa-free-code-camp" /></strong>
        </span>
      </div>
      <nav className="navbar navbar-static-top">
        <a className="sidebar-toggle" href="#" data-toggle="offcanvas">
          <span className="sr-only">Toggle navigation</span>
        </a>
        <div className="navbar-custom-menu">
          <ul className="nav navbar-nav">

            <li className="dropdown notifications-menu">
              <a href="#" className="dropdown-toggle" data-toggle="dropdown">
                <i className="fa fa-bell-o"/>
                <span className="label label-warning">{ws_notification.length || ''}</span>
              </a>
              <ul className="dropdown-menu">
                <li className="header">You have {ws_notification.length || 'no new'} notification{ws_notification.length === 1 ? '' : 's'}</li>
                <li>
                  <ul className="menu" style={{
                    'overflow': 'hidden',
                    'width': '100%',
                    'height': '200px'
                  }}>

                  {ws_notification.map((notification, i) => {
                    return (
                      <WSNotification key={`ws-notification${i}`}
                        url={notification.url}
                        message={notification.message}
                        consumeNotification={consumeNotification}
                        index={i} icon={notification.icon}
                        iconColour={notification.iconColour} />
                    );
                  })}

                  </ul>
                </li>
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

            <li>
              <a href="#" data-toggle="control-sidebar">
                <i className="fa fa-gears" />
              </a>
            </li>

          </ul>
        </div>
      </nav>
    </header>
  );
};

Header.propTypes = {
  user: PropTypes.object,
  ws_notification: PropTypes.array.isRequired,
  consumeNotification: PropTypes.func.isRequired
};

export default Header;
