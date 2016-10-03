import React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Button } from 'react-bootstrap';
import _ from 'lodash';

import UploadFileModal from '../components/ImportSubscribers/UploadFileModal';
import SubscribersTable from '../components/ImportSubscribers/SubscribersTable';
import ErrorsList from '../components/ImportSubscribers/ErrorsList';

import previewCSV from '../utils/subscriberListParsers/parseSubscriberList';
import { submitCSV } from '../actions/subscribersActions';

function mapStateToProps(state) {
  return { isAdding: state.list.isAdding }
}

@connect(mapStateToProps, { submitCSV })
export default class ImportSubscribers extends React.Component {
  constructor() {
    super();

    this.state = {
      file: null,
      fields: null,
      subscribers: null,
      errors: null
    };
  }

  componentWillReceiveProps(props) {
      if (!props.isAdding) {
          this.cancelImport();
      }
  }

  handleNewFile(file) {

    const callback = (results) => {
        const errors = results.errors;
        const subscribers = results.data;
        const fields = results.meta.fields;
        // If errors were encountered don't show the
        // dodgy csv/subscribers list to users
        if (_.isEmpty(errors)) {
          this.setState({
            file: file,
            subscribers: subscribers,
            fields: fields
          });
        } else {
          this.setState({
            errors: errors
          });
        }
    }

    previewCSV(file, callback);
  }

  handleSubmit(e) {
    e.preventDefault();

    const file = this.state.file;
    this.props.submitCSV(this.state.file);
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
          <h1>Import Subscribers <small>Import subscribers from a CSV file</small></h1>
        </div>

        <section className="content">
        {this.props.isAdding
            ?        <Row>
                        <Col md={12}>

                            <div className="box box-primary">
                              <div className="box-header with-border">
                                <h3 className="box-title">Your CSV file is uploading ...</h3>
                              </div>

                              <div className="box-body">
                                <p>Loading...</p>
                              </div>

                            </div>

                        </Col>
                      </Row>

            :         <Row>
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
                                {(this.state.subscribers || this.state.errors) &&
                                <Button onClick={this.cancelImport.bind(this)}>Cancel</Button>
                                }

                                {this.state.subscribers &&
                                <Button className="pull-right" bsStyle="primary" type="submit" onClick={this.handleSubmit.bind(this)}>Submit</Button>
                                }
                              </div>
                            </div>

                        </Col>
                      </Row>
                  }

        </section>
      </div>
    );
  }
}

ImportSubscribers.propTypes = {
  submitCSV: React.PropTypes.func.isRequired
};
