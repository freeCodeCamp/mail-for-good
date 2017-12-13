import React, { Component, PropTypes } from 'react';
import FontAwesome from 'react-fontawesome';
import CampaignReportsTable from '../../components/analytics/CampaignReportsTable';

export default class CampaignReports extends Component {

  static propTypes = {
    isGetting: PropTypes.bool
  }

  state = {
    data: []
  }

  render() {
    return (
      <div>
        <div className="content-header">
          <h1>Manage campaigns
            <small>Edit or delete your campaigns here</small>
          </h1>
        </div>

        <section className="content">
          <div className="box">
            <div className="box-header">
              <h3 className="box-title">Your campaigns</h3>
            </div>

            <div className="box-body">

              <CampaignReportsTable data={this.state.data} />

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
