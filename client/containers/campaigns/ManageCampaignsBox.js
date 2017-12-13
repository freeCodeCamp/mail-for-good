import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import FontAwesome from 'react-fontawesome';

import ManageCampaignsTable from '../../components/campaigns/ManageCampaignsTable';
import ManageCampaignsGraph from '../../components/campaigns/ManageCampaignsGraph';

import { getCampaigns, deleteCampaigns } from '../../actions/campaignActions';

function mapStateToProps(state) {
  // State reducer @ state.manageCampaign
  return {
    campaigns: state.manageCampaign.campaigns,
    isGetting: state.manageCampaign.isGetting
  };
}

const mapDispatchToProps = { getCampaigns, deleteCampaigns };

export class ManageCampaignsBoxComponent extends Component {

  static propTypes = {
    campaigns: PropTypes.array.isRequired,
    isGetting: PropTypes.bool.isRequired,
    getCampaigns: PropTypes.func.isRequired,
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
    this.props.getCampaigns();
  }

  deleteRows(campaignIds) { // campaignIds [...Numbers]
    this.props.deleteCampaigns(campaignIds, this.props.campaigns);
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

          <ManageCampaignsTable
            data={this.props.campaigns}
            deleteRows={this.deleteRows}
            getCampaignView={this.getCampaignView} />
          {this.props.isGetting && <div className="overlay">
            <FontAwesome name="refresh" spin/>
          </div>}

          <ManageCampaignsGraph data={this.props.campaigns} />
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageCampaignsBoxComponent);
