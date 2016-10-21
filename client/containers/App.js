import React from 'react';

import Header from '../components/admin-lte/Header.js';
import Sidebar from '../components/admin-lte/Sidebar.js';
import Footer from '../components/admin-lte/Footer.js';
import Notifications from './Notifications';
import io from 'socket.io-client';

export default class App extends React.Component {
  state = {
    user: {}
  }

  componentWillMount() {
    const socket = io();
    socket.emit('login');

    socket.on('loginResponse', data => {
      this.setState({ user:data });
    });
  }

  render() {
    return (
      <div className="wrapper">
        <Header user={this.state.user} />
        <Sidebar user={this.state.user} />

        <div className="content-wrapper">
          {this.props.children}
        </div>

        <Notifications />

        <Footer />
      </div>
    );
  }
}

App.propTypes = {
  children: React.PropTypes.element.isRequired
};
