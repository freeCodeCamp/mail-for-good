import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Button } from 'react-bootstrap';

import UploadFileModal from './UploadFileModal';
import SubscribersTable from '../../components/lists/SubscribersTable';
import ErrorsList from '../../components/lists/ErrorsList';

import previewCSV from '../../utils/subscriberListParsers/parseSubscriberList';

function mapStateToProps(state) {
  // State reducer @ state.createList
  return { isPosting: state.createList.isPosting };
}

@connect(mapStateToProps, null)
export default class ImportCSV extends Component {

  static propTypes = {
    handleCSVSubmit: PropTypes.func.isRequired,
    isPosting: PropTypes.bool.isRequired,
    notification: PropTypes.func.isRequired
  }

  state = {
    file: null,
    fields: null,
    subscribers: null,
    errors: null
  }

  componentWillReceiveProps(props) {
    if (!props.isPosting) {
      this.cancelImport();
    }
  }

  handleErrorWithFile(err) { // Err is a string informing user of an issue with the csv
    this.props.notification({ // Ref https://github.com/pburtchaell/react-notification & https://github.com/pburtchaell/react-notification/blob/master/src/notification.js
      message: err,
      colour: 'red'
    });
  }

  handleNewFile(file) {

    const callback = (results) => {
      if (!results.meta.fields.some(field => field.toLowerCase() === 'email')) { // Check if any header field is labeled email
        this.handleErrorWithFile('Please ensure the CSV file contains at least one column field labeled "email" (check the first row)');
      } else {

        const errors = results.errors;
        const subscribers = results.data;
        const fields = results.meta.fields;
        // If errors were encountered don't show the
        // dodgy csv/subscribers list to users
        const errorIsNotSignificant = (errors) => { // Check that thrown errors are actually errors
          if (errors.length) {
            return errors.every(i => { // Put allowed errors below
              return i.code === 'UndetectableDelimiter'; // UndetectableDelimiter can occur when the CSV files has one column, as no delimiter is present
            });
          } else {
            return true;
          }
        };

        if (errorIsNotSignificant(errors)) {
          this.setState({file: file, subscribers: subscribers, fields: fields});
        } else {
          this.setState({errors: errors});
        }

      }
    };

    previewCSV(file, callback);
  }

  handleSubmit(e) {
    e.preventDefault();

    this.props.handleCSVSubmit(this.state.file, this.state.fields);
  }

  deleteSubscriber(subscriberId) {
    // Deletes the subscriber at subscriberId then
    // updates state accordingly
    let newSubscribers = this.state.subscribers;

    newSubscribers.splice(subscriberId, 1);

    this.setState({subscribers: newSubscribers});
  }

  cancelImport() {
    this.setState({subscribers: null, fields: null, errors: null});
  }

  render() {
    return (
      <div>
        { this.props.isPosting
          ? <Row>
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

          : <Row>
            <Col md={12}>

              <div className="box">
                <div className="box-header with-border">
                  <h2>Import CSV</h2>
                  <h3 className="box-title"><i className="fa fa-exclamation-circle text-red"/> Please ensure the first row of the CSV file contains column names. This row must contain an email header.</h3>
                </div>

                <div className="box-body">
                  {(!this.state.subscribers && !this.state.errors) && <UploadFileModal handleNewFile={this.handleNewFile.bind(this)}/>}

                  <ErrorsList errors={this.state.errors}/>

                  <SubscribersTable fields={this.state.fields} subscribers={this.state.subscribers} deleteSubscriber={this.deleteSubscriber.bind(this)}/>
                </div>

                <div className="box-footer">
                  {(this.state.subscribers || this.state.errors) && <Button onClick={this.cancelImport.bind(this)}>Cancel</Button>}

                  {this.state.subscribers && <Button className="pull-right" bsStyle="primary" type="submit" onClick={this.handleSubmit.bind(this)}>Submit</Button>}
                </div>
              </div>

            </Col>
          </Row>
        }

      </div>
    );
  }
}
