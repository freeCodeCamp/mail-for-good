import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import FontAwesome from 'react-fontawesome';
import slug from 'slug';

import ManageCampaignsTable from '../../components/campaigns/ManageCampaignsTable';

import { getCampaigns } from '../../actions/campaignActions';

function mapStateToProps(state) {
  // State reducer @ state.manageCampaign
  return { campaigns: state.manageCampaign.campaigns, isGetting: state.manageCampaign.isGetting };
}

@connect(mapStateToProps, { getCampaigns })
export default class ManageCampaigns extends Component {
  constructor() {
    super();
    this.deleteRows = this.deleteRows.bind(this);
    this.getCampaignView = this.getCampaignView.bind(this);
  }

  static propTypes = {
    getCampaigns: PropTypes.func.isRequired,
    campaigns: PropTypes.array.isRequired,
    isGetting: PropTypes.bool.isRequired
  }

  componentDidMount() {
    // Update campaigns only if we need to
    if (!this.props.campaigns.length) {
      this.props.getCampaigns();
    }
  }

  deleteRows(rows) {

  }

  getCampaignView(row) {
    // Send user to the campaign view container
    const urlSlug = slug(row.name);
    browserHistory.push(`campaigns/manage/${urlSlug}`);
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

              <ManageCampaignsTable data={this.props.campaigns} deleteRows={this.deleteRows} getCampaignView={this.getCampaignView} />

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
