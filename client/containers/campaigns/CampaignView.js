import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import FontAwesome from 'react-fontawesome';
import { getCampaigns, postSendCampaign } from '../../actions/campaignActions';

function mapStateToProps(state) {
  // State reducer @ state.manageCampaign
  return {
    campaigns: state.manageCampaign.campaigns,
    isGetting: state.manageCampaign.isGetting,
    isPosting: state.sendCampaign.isPosting
  };
}

@connect(mapStateToProps, { getCampaigns, postSendCampaign })
export default class CampaignView extends Component {
  constructor() {
    super();
    this.sendCampaign = this.sendCampaign.bind(this);
  }

  static PropTypes = {
    getCampaigns: PropTypes.func.isRequired,
    campaigns: PropTypes.array.isRequired,
    isGetting: PropTypes.bool.isRequired,
    sendCampaign: PropTypes.func.isRequired,
    isPosting: PropTypes.bool.isRequired
  }

  state = {
    thisCampaign: {}
  }

  componentWillReceiveProps(props) {
    // Set thisCampaign from campaigns once we have it
    if (props.campaigns && props.campaigns.length && !this.props.campaigns.length) { // Guarded and statement that confirms campaigns is in the new props, confirms the array isn't empty, and then confirms that current props do not exist
      this.getSingleCampaign(props);
    }
  }

  componentDidMount() {
    // Update campaigns only if we need to
    if (!this.props.campaigns.length) {
      this.props.getCampaigns();
    } else {
      this.getSingleCampaign(this.props);
    }
  }

  getSingleCampaign(props) {
    // This method retrieves a single campaign from this.props.campaigns based on the parameter in the url
    const slug = this.props.params.slug;
    const getCampaignbySlug = props.campaigns.find(campaign => campaign.slug === slug);
    this.setState({
      thisCampaign: getCampaignbySlug
    });
  }

  sendCampaign() {
    // Send id of campaign row to server for execution @ this.state.thisCampaign.id
    this.props.postSendCampaign(JSON.stringify(this.state.thisCampaign.id));
  }

  render() {
    return (
      <div>
        <div className="content-header">
          <h1>View your campaign
            <small>Edit, delete and see stats about this campaign</small>
          </h1>
        </div>

        <section className="content">
          <div className="box box-primary">
            <div className="box-header">
              <h3 className="box-title">{this.state.thisCampaign.name}</h3>
            </div>

            <div className="box-body">

              <button className="btn btn-primary" type="button" onClick={this.sendCampaign}>Send</button>

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
