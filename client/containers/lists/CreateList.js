import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {Row, Col} from 'react-bootstrap';
import {NotificationStack} from 'react-notification';

import ImportCSV from './ImportCSV';

import {submitCSV} from '../../actions/listActions';

@connect(null, {submitCSV})
export default class CreateList extends Component {
  static propTypes = {
    submitCSV: PropTypes.func.isRequired
  }

  constructor() {
    super();

    this.state = {
      notifications: []
    };

    this.handleCSVSubmit = this.handleCSVSubmit.bind(this);
    this.notification = this.notification.bind(this);
  }

  notification(notification) { // Ref https://github.com/pburtchaell/react-notification & https://github.com/pburtchaell/react-notification/blob/master/src/notification.js
    // Set position based on sidebar collapsed state
    if (document.body.classList.contains('sidebar-collapse')) {
      notification.activeBarStyle.left = '6rem';
    } else {
      notification.activeBarStyle.left = '25rem';
    }
    notification.dismissAfter = 10000; // In ms
    notification.isActive = true; // Is displayed

    const newNotifications = this.state.notifications;
    newNotifications.push(notification);
    this.setState({notifications: newNotifications});
  }

  handleCSVSubmit(file, headers) { // Get the csv file, headers of said file & then get the name of the list
    const title = document.getElementById('list-id').value;
    // List title should not be empty
    if (title === '') {
      this.notification({ // Ref https://github.com/pburtchaell/react-notification & https://github.com/pburtchaell/react-notification/blob/master/src/notification.js
        message: 'Please provide a name for this list',
        activeBarStyle: {
          background: 'red'
        }
      }); // Validation complete, send to server
    } else {
      this.props.submitCSV(file, headers, title);
    }
  }

  render() {
    return (
      <div>
        <div className="content-header">
          <h1>Create List
            <small>Add or segment a new list</small>
          </h1>
        </div>

        <section className="content">

          <Row>
            <Col xs={12} md={12}>
              <div className="nav-tabs-custom">
                <ul className="nav nav-tabs pull-right">
                  <li className="">
                    <a href="#tab_1-1" data-toggle="tab" aria-expanded="false">Tab 1 (Add email)</a>
                  </li>
                  <li>
                    <a href="#tab_2-2" data-toggle="tab">Tab 2 (Segment list)</a>
                  </li>
                  <li className="active">
                    <a href="#tab_3-2" data-toggle="tab" aria-expanded="true">Import CSV</a>
                  </li>
                  <li className="pull-left header"><i className="fa fa-th"/>
                    Import a list</li>
                </ul>

                <div className="box box-primary">
                  <Row>
                    <Col md={12}>
                      <div className="box-header with-border">
                        <h3 className="box-title">List name</h3>
                      </div>

                      <form role="form">
                        <div className="box-body">

                          <div className="form-group">
                            <input className="form-control" id="list-id" placeholder="The name of this list" type="text"/>
                          </div>

                        </div>

                      </form>
                    </Col>
                  </Row>
                </div>

                <div className="tab-content">
                  <div className="tab-pane" id="tab_1-1">
                    Example text
                  </div>

                  <div className="tab-pane" id="tab_2-2">
                    Example text
                  </div>

                  <div className="tab-pane active" id="tab_3-2">
                    <ImportCSV handleCSVSubmit={this.handleCSVSubmit} notification={this.notification}/>
                  </div>
                </div>
              </div>
            </Col>
          </Row>

          <NotificationStack notifications={this.state.notifications} onDismiss={() => this.setState({notifications: this.state.notifications.slice(1)})}/>

        </section>
      </div>
    );
  }
}
