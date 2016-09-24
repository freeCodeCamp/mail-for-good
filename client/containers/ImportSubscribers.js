import React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Button } from 'react-bootstrap';

import UploadFileModal from '../components/ImportSubscribers/UploadFileModal';
import SubscribersTable from '../components/ImportSubscribers/SubscribersTable';

import parseSubscriberList from '../utils/subscriberListParsers/parseSubscriberList';
import { addSubscribers } from '../actions/subscribersActions';


@connect(null, { addSubscribers })
export default class ImportSubscribers extends React.Component {
  constructor() {
    super();
    
    this.state = {
      fields: null,
      subscribers: null
    };
  }
  
  handleNewFile(text) {
    const data = parseSubscriberList(text);
    
    this.setState({
      subscribers: data.subscribers,
      fields: data.fields
    });
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
      fields: null
    });
  }

  render() {
    console.log(this.state);
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
                    {!this.state.subscribers &&
                      <UploadFileModal handleNewFile={this.handleNewFile.bind(this)} />
                    }
                    
                    <SubscribersTable
                      fields={this.state.fields}
                      subscribers={this.state.subscribers}
                      deleteSubscriber={this.deleteSubscriber.bind(this)}
                    />
                  </div>

                  <div className="box-footer">
                    {this.state.subscribers &&
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
