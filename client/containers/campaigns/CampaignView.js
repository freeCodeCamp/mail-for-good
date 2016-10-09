import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import FontAwesome from 'react-fontawesome';


export default class CampaignView extends Component {
  static PropTypes = {
  }

  render() {
    return (
      <div>
        <div className="content-header">
          <h1>View your campaign
            <small>Edit or delete your campaigns here</small>
          </h1>
        </div>

        <section className="content">
          <div className="box">
            <div className="box-header">
              <h3 className="box-title">Your campaigns</h3>
            </div>

            <div className="box-body">

              {this.props.isGetting && <div className="overlay">
                <FontAwesome name="refresh" spin/>
              </div>}
            </div>
          </div>
        </section>
      </div>
    );
  }
}
