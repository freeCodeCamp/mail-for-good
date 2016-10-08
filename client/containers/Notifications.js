import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { NotificationStack } from 'react-notification';

import { consume } from '../actions/notificationActions';

function mapStateToProps(state) {
  return {
    notifications: state.notifications.stack
  };
}

@connect(mapStateToProps, { consume })
export default class Notifications extends Component {
  static propTypes = {
    notifications: PropTypes.array.isRequired,
    consume: PropTypes.func.isRequired
  }
  
  constructor(props) {
    super(props);

    this.state = {
      notifications: []
    };
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      notifications: newProps.notifications
    });
  }

  notification(notification) { // Ref https://github.com/pburtchaell/react-notification & https://github.com/pburtchaell/react-notification/blob/master/src/notification.js
    // Set position based on sidebar collapsed state
    const newNotifications = this.state.notifications;
    newNotifications.push(notification);
    this.setState({notifications: newNotifications});
  }


  render() {
    let left = '25rem';
    if (document.body.classList.contains('sidebar-collapse')) {
      left = '6rem';
    }

    const notifications = this.state.notifications.reduce((prev, notification) => {
      return prev.concat({
        ...notification,
        activeBarStyle: {
          ...notification.activeBarStyle,
          left
        }
      });
    }, []);
    
    return (
      <NotificationStack notifications={notifications} onDismiss={this.props.consume.bind(this)}/>
    );
  }
}
