import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { initialize } from 'redux-form';

import { notify } from '../../actions/notificationActions';
import FontAwesome from 'react-fontawesome';

export default class CreateCampaign extends Component {

  static propTypes = {

  }

  constructor() {
    super();
  }

  render() {

    return (
      <div>
        <div className="content-header">
          <h1>Grant Permissions
            <small>Grant permisssions to users</small>
          </h1>
        </div>

        <section className="content">
          <div className="box box-primary">
            <div className="box-body">
              a
            </div>

            {/*<div className="overlay">
              <FontAwesome name="refresh" spin/>
            </div>*/}
          </div>
        </section>

      </div>
    );
  }
}
