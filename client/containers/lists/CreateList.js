import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';

import ImportCSV from './ImportCSV';

import { submitCSV, getLists } from '../../actions/listActions';
import { notify } from '../../actions/notificationActions';

function mapStateToProps(state) {
  // State reducer @ state.manageList
  return {
    lists: state.manageList.lists,
    isGetting: state.manageList.isGetting
  };
}

@connect(mapStateToProps, { submitCSV, notify, getLists })
export default class CreateList extends Component {

  static propTypes = {
    submitCSV: PropTypes.func.isRequired,
    notify: PropTypes.func.isRequired,
    getLists: PropTypes.func.isRequired,
    lists: PropTypes.array.isRequired,
    isGetting: PropTypes.bool.isRequired
  }

  constructor() {
    super();
    this.handleCSVSubmit = this.handleCSVSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  state = {
    title: ''
  }

  componentDidMount() {
    // Update lists only if we need to
    if (!this.props.lists.length) {
      this.props.getLists();
    }
  }

  notification(notification) {
    this.props.notify(notification);
  }

  handleCSVSubmit(file, headers) {
    const { title } = this.state;
    // List title should not be empty
    if (title === '') {
      this.props.notify({ message: 'Please provide a name for this list' });
    }
    else if (this.props.lists.some(x => x.name === title)) {
      // Notify if list name exists
      this.props.notify({ message: 'This list already exists, please provide a unique name' });
    }
    else {
      this.props.submitCSV(file, headers, title);
      this.setState({ title: '' });
      this.props.notify({
        message: 'Your CSV is being uploaded',
        colour: 'green'
      });
    }
  }

  handleChange(e) {
    this.setState({
      [e.target.id]: e.target.value
    });
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
                            <input className="form-control" id="title" placeholder="The name of this list" type="text" value={this.state.title} onChange={this.handleChange} />
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

          {this.props.isGetting && <div className="overlay">
            <FontAwesome name="refresh" spin/>
          </div>}

        </section>
      </div>
    );
  }
}
