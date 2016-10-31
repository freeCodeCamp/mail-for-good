import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Header from '../components/admin-lte/Header.js';
import Sidebar from '../components/admin-lte/Sidebar.js';
import Footer from '../components/admin-lte/Footer.js';
import Notifications from './Notifications';
import { emitProfileRequest, consumeNotification } from '../actions/appActions';

function mapStateToProps(state) {
  return {
    user: state.profile.user,
    ws_notification: state.profile.ws_notification
  };
}

@connect(mapStateToProps, { emitProfileRequest, consumeNotification })
export default class App extends Component {

  static propTypes = {
    children: PropTypes.element.isRequired,
    emitProfileRequest: PropTypes.func.isRequired,
    consumeNotification: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    ws_notification: PropTypes.array.isRequired
  }

  componentWillMount() {
    this.props.emitProfileRequest();
  }

  render() {
    return (
      <div className="wrapper">
        <Header user={this.props.user} ws_notification={this.props.ws_notification} consumeNotification={this.props.consumeNotification} />
        <Sidebar user={this.props.user} />

        <div className="content-wrapper">
          {this.props.children}
        </div>

        <Notifications />
        <Footer />
      </div>
    );
  }
}
