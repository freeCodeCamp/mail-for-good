import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { NotificationStack } from 'react-notification';

import { consume } from '../actions/notificationActions';

function mapStateToProps(state) {
  return {
    notifications: state.notifications.stack
  };
}

const mapDispatchToProps = { consume };

export class NotificationsComponent extends Component {
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

    const notifications = this.state.notifications.reduce((prev, notification, i) => {
      return prev.concat({
        ...notification,
        key: `stack${i}`,
        action: 'Dismiss',
        onClick: () => {
          this.props.consume.bind(this)();
        },
        activeBarStyle: {
          ...notification.activeBarStyle,
          left
        },
        actionStyle: {
          color: 'white'
        }
      });
    }, []);

    const activeBarStyleFactory = (index, style) => {
      return Object.assign(
        {},
        style,
        {
          bottom: `${6 + index * 4}rem`,
          font: '1.5rem normal Roboto, sans-serif'
        }
      );
    };

    return (
      <NotificationStack notifications={notifications} onDismiss={this.props.consume.bind(this)} activeBarStyleFactory={activeBarStyleFactory} />
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NotificationsComponent);