import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Row, Col, FormControl } from 'react-bootstrap';

import SubscribersTable from '../../components/lists/SubscribersTable';
import ErrorsList from '../../components/lists/ErrorsList';

import previewCSV from '../../utils/subscriberListParsers/parseSubscriberList';

function mapStateToProps(state) {
  // State reducer @ state.createList
  return {
    isPosting: state.createList.isPosting,
    upload: state.createList.upload
  };
}

export class ImportCSVComponent extends Component {

  static propTypes = {
    handleCSVSubmit: PropTypes.func.isRequired,
    isPosting: PropTypes.bool.isRequired,
    notification: PropTypes.func.isRequired,
    upload: PropTypes.oneOfType([PropTypes.number, PropTypes.object])
  }

  state = {
    file: null,
    fields: null,
    subscribers: null,
    errors: null
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.isPosting) {
      this.cancelImport();
    }
  }

  handleErrorWithFile(err) { // Err is a string informing user of an issue with the csv
    this.props.notification({ // Ref https://github.com/pburtchaell/react-notification & https://github.com/pburtchaell/react-notification/blob/master/src/notification.js
      message: err
    });
  }

  handleNewFile(file) {

    const callback = results => {
      if (!results.meta.fields.some(field => field.toLowerCase() === 'email' || 'e-mail')) { // Check if any header field is labeled email
        this.handleErrorWithFile('Please ensure the CSV file contains at least one column field labeled "email/e-mail" (check the first row)');
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
    this.setState({
      subscribers: null,
      fields: null,
      errors: null
    });
  }

  onUpload(e) {
    const files = e.target.files;
    this.handleNewFile(files[0]);
  }

  render() {
    return (
      <div>
        { this.props.isPosting
          ? <Row>
              <Col md={12}>

                <div className="box-header">
                  <h3 className="box-title">Initiating upload...</h3>

                  <div className="progress">
                    <div style={{ width: `${this.props.upload}%` }} className="progress-bar progress-bar-aqua" role="progressbar" aria-valuenow={this.props.upload} aria-valuemin="0" aria-valuemax="100">
                      <span className="sr-only">{this.props.upload}% Complete</span>
                    </div>
                  </div>
                </div>

                <div className="box-body">
                  <p>Loading...</p>
                </div>

              </Col>
        </Row>

          : <Row>
          <Col md={12}>

            <div className="box-header">
              <h2>Import CSV</h2>
              <h3 className="box-title">Please ensure the first row of the CSV file contains column names. This row must contain an email header.</h3>
            </div>

            <div className="box-body">
            {/*The label as been put in place of the input and the input is hidden
              we can't style a file input but we can style its label
              and clicking the label is equivalent to clicking the input*/}
              {(!this.state.subscribers && !this.state.errors) && <label htmlFor="fileInput" className="btn pull-left btn-lg btn-primary">Import</label>}
              <FormControl id="fileInput" accept=".csv" style={{display:"none"}} className="btn" type="file" onChange={this.onUpload.bind(this)}/>

              <ErrorsList errors={this.state.errors}/>

              <SubscribersTable fields={this.state.fields} subscribers={this.state.subscribers} deleteSubscriber={this.deleteSubscriber.bind(this)}/>
            </div>

            <div className="box-footer">
              <div className="btn-group">
                {this.state.subscribers && <button style={{ margin: "1em", width: "160px" }} className="btn pull-left btn-lg btn-success" type="submit" onClick={this.handleSubmit.bind(this)}>Submit</button>}

                {(this.state.subscribers || this.state.errors) && <button style={{ margin: "1em", width: "160px" }} className="btn pull-right btn-lg btn-danger" onClick={this.cancelImport.bind(this)}>Cancel</button>}
              </div>
            </div>

          </Col>
        </Row>
        }

      </div>
    );
  }
}

export default connect(mapStateToProps)(ImportCSVComponent);
