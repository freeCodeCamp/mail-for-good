import React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Button } from 'react-bootstrap';
import _ from 'lodash';

import UploadFileModal from '../components/ImportSubscribers/UploadFileModal';
import SubscribersTable from '../components/ImportSubscribers/SubscribersTable';
import ErrorsList from '../components/ImportSubscribers/ErrorsList';

import parseSubscriberList from '../utils/subscriberListParsers/parseSubscriberList';
import { addSubscribers } from '../actions/subscribersActions';


@connect(null, { addSubscribers })
export default class ImportSubscribers extends React.Component {
  constructor() {
    super();

    this.state = {
      fields: null,
      subscribers: null,
      errors: null
    };
  }

  handleNewFile(text) {
    const data = parseSubscriberList(text);

    // If errors were encountered don't show the
    // dodgy csv/subscribers list to users
    if (_.isEmpty(data.errors)) {
      this.setState({
        subscribers: data.subscribers,
        fields: data.fields
      });
    } else {
      this.setState({
        errors: data.errors
      });
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    const newSubscribers = {
      subscribers: this.state.subscribers,
      fields: this.state.fields
    };

    this.props.addSubscribers(newSubscribers);
  }

  deleteSubscriber(subscriberId) {
    // Deletes the subscriber at subscriberId then
    // updates state accordingly
    let newSubscribers = this.state.subscribers;

    newSubscribers.splice(subscriberId, 1);

    this.setState({
      subscribers: newSubscribers
    });
  }

  cancelImport() {
    this.setState({
      subscribers: null,
      fields: null,
      errors: null
    });
  }

  render() {
    return (
      <div>
        <div className="content-header">
          <h1>Import Subscribers <small>Import subscribers from a file</small></h1>
        </div>

        <section className="content">
          <Row>
            <Col md={12}>

                <div className="box box-primary">
                  <div className="box-header with-border">
                    <h3 className="box-title">Subscribers to import</h3>
                  </div>

                  <div className="box-body">
                    {(!this.state.subscribers && !this.state.errors) &&
                      <UploadFileModal handleNewFile={this.handleNewFile.bind(this)} />
                    }

                    <ErrorsList errors={this.state.errors}/>

                    <SubscribersTable
                      fields={this.state.fields}
                      subscribers={this.state.subscribers}
                      deleteSubscriber={this.deleteSubscriber.bind(this)}
                    />
                  </div>

                  <div className="box-footer">
                    {this.state.subscribers || this.state.errors &&
                    <Button onClick={this.cancelImport.bind(this)}>Cancel</Button>
                    }

                    {this.state.subscribers &&
                    <Button className="pull-right" bsStyle="primary" type="submit" onClick={this.handleSubmit.bind(this)}>Submit</Button>
                    }
                  </div>
                </div>

            </Col>
          </Row>
        </section>
      </div>
    );
  }
}

ImportSubscribers.propTypes = {
  addSubscribers: React.PropTypes.func.isRequired
};
