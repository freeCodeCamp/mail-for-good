import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import FontAwesome from 'react-fontawesome';
import { getCampaigns, postSendCampaign, postTestEmail } from '../../actions/campaignActions';
import { notify } from '../../actions/notificationActions';
import PreviewTemplateForm from '../../components/templates/PreviewTemplateForm';

function mapStateToProps(state) {
  // State reducer @ state.manageCampaign
  return {
    campaigns: state.manageCampaign.campaigns,
    isGetting: state.manageCampaign.isGetting,

    isPosting: state.sendCampaign.isPosting,
    sendCampaignResponse: state.sendCampaign.sendCampaignResponse,
    sendCampaignStatus: state.sendCampaign.sendCampaignStatus
  };
}

@connect(mapStateToProps, { getCampaigns, postSendCampaign, postTestEmail, notify })
export default class CampaignView extends Component {

  static propTypes = {
    // actions
    postSendCampaign: PropTypes.func.isRequired,
    postTestEmail: PropTypes.func.isRequired,
    getCampaigns: PropTypes.func.isRequired,
    notify: PropTypes.func.isRequired,
    // redux
    campaigns: PropTypes.array.isRequired,
    isGetting: PropTypes.bool.isRequired,
    sendCampaign: PropTypes.func,
    isPosting: PropTypes.bool.isRequired,
    sendCampaignResponse: PropTypes.string.isRequired,
    sendCampaignStatus: PropTypes.number.isRequired,
    // route path
    params: PropTypes.object.isRequired
  }

  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  state = {
    thisCampaign: {},
    showModal: false,
    haveShownMessage: false
  }

  componentWillMount() {
    // Update campaigns only if we need to
    if (!this.props.campaigns.length) {
      this.props.getCampaigns();
    } else {
      this.getSingleCampaign(this.props);
    }
  }

  componentWillReceiveProps(props) {
    // Set thisCampaign from campaigns once we have it
    if (props.campaigns && props.campaigns.length && !this.props.campaigns.length) { // Guarded and statement that confirms campaigns is in the new props, confirms the array isn't empty, and then confirms that current props do not exist
      this.getSingleCampaign(props);
    }
    // Show success/failure toast
    if (props.sendCampaignResponse && !props.isPosting) {
      this.setState({ haveShownMessage: true });
      if (props.sendCampaignStatus === 200) {
        this.props.notify({
          message: 'Your campaign is being sent',
          colour: 'green'
        });
      } else {
        this.props.notify({
          message: 'There was an error sending your campaign'
        });
      }
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

  handleSubmit() {
    const form = {
      id: this.state.thisCampaign.id
    };

    this.props.postSendCampaign(JSON.stringify(form));
    this.close();
  }

  render() {
    return (
      <div>
        <div className="content-header">
          <h1>Your Campaign
            <small>View and send your campaign</small>
          </h1>
        </div>

        <section className="content">
          <div className="box box-primary">
            <div className="box-header">
              <h3 className="box-title">Campaign: {this.state.thisCampaign.name}</h3>
            </div>

            <div className="box-body">

              {(this.props.sendCampaignResponse && this.state.haveShownMessage) &&
                <p className={this.props.sendCampaignStatus === 200 ? 'text-green' : 'text-red'}>
                  <i className={this.props.sendCampaignStatus === 200 ? 'fa fa-check' : 'fa fa-exclamation'}/> {this.props.sendCampaignResponse}
                </p>}

              <PreviewTemplateForm campaignView={this.state.thisCampaign} />

              {this.props.isGetting || this.props.isPosting && <div className="overlay">
                <FontAwesome name="refresh" spin/>
              </div>}
            </div>
          </div>
        </section>
      </div>
    );
  }
}
