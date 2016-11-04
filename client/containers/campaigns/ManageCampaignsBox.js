import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import FontAwesome from 'react-fontawesome';

import ManageCampaignsTable from '../../components/campaigns/ManageCampaignsTable';

import { getCampaigns, deleteCampaigns } from '../../actions/campaignActions';

function mapStateToProps(state) {
  // State reducer @ state.manageCampaign
  return {campaigns: state.manageCampaign.campaigns, isGetting: state.manageCampaign.isGetting};
}

@connect(mapStateToProps, {getCampaigns, deleteCampaigns})
export default class ManageCampaignsBox extends Component {

  static propTypes = {
    getCampaigns: PropTypes.func.isRequired,
    campaigns: PropTypes.array.isRequired,
    isGetting: PropTypes.bool.isRequired,
    deleteCampaigns: PropTypes.func.isRequired
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  constructor() {
    super();
    this.deleteRows = this.deleteRows.bind(this);
    this.getCampaignView = this.getCampaignView.bind(this);
  }

  componentDidMount() {
    // Update campaigns only if we need to
    if (!this.props.campaigns.length) {
      this.props.getCampaigns();
    }
  }

  deleteRows(campaignIds) { // campaignIds [...Numbers]
    const jsonCampaignIds = JSON.stringify({data: campaignIds});
    this.props.deleteCampaigns(jsonCampaignIds);
  }

  getCampaignView(row) {
    // Send user to the campaign view container
    this.context.router.push(`/campaigns/manage/${row.slug}`);
  }

  render() {
    return (
      <div className="box box-primary">
        <div className="box-header">
          <h3 className="box-title">Your campaigns</h3>
        </div>

        <div className="box-body">

          <ManageCampaignsTable data={this.props.campaigns} deleteRows={this.deleteRows} getCampaignView={this.getCampaignView}/> {this.props.isGetting && <div className="overlay">
            <FontAwesome name="refresh" spin/>
          </div>}
        </div>
      </div>
    );
  }
}
