import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { notify } from '../../actions/notificationActions';
import FontAwesome from 'react-fontawesome';
import { getCampaigns, postSendCampaign } from '../../actions/campaignActions';
import { Modal, Button } from 'react-bootstrap';

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

@connect(mapStateToProps, { getCampaigns, postSendCampaign, notify })
export default class CampaignView extends Component {

  static propTypes = {
    getCampaigns: PropTypes.func.isRequired,
    campaigns: PropTypes.array.isRequired,
    isGetting: PropTypes.bool.isRequired,
    sendCampaign: PropTypes.func.isRequired,
    isPosting: PropTypes.bool.isRequired,
    sendCampaignResponse: PropTypes.string.isRequired,
    sendCampaignStatus: PropTypes.number.isRequired,
    notify: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    postSendCampaign: PropTypes.func.isRequired
  }

  constructor() {
    super();
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  state = {
    thisCampaign: {},
    showModal: false
  }

  componentDidMount() {
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
    if (props.sendCampaignResponse) {
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

  open() {
    this.setState({
      showModal: true
    });
  }

  close() {
    this.setState({
      showModal: false
    });
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
              <h3 className="box-title">Campaign: {this.state.thisCampaign.name}</h3>
            </div>

            <div className="box-body">

              {this.props.sendCampaignResponse &&
                <p className={this.props.sendCampaignStatus === 200 ? 'text-green' : 'text-red'}>
                  <i className={this.props.sendCampaignStatus === 200 ? 'fa fa-check' : 'fa fa-exclamation'}/> {this.props.sendCampaignResponse}
                </p>}

              <button className="btn btn-primary" type="button" onClick={this.open}>Send</button>

              <Modal show={this.state.showModal} onHide={this.close}>
                <Modal.Header closeButton>
                  <Modal.Title>Are you sure you would like to send this campaign?</Modal.Title>
                </Modal.Header>

                <Modal.Footer>
                  <Button onClick={this.close}>No</Button>
                  <Button bsStyle="primary" onClick={this.handleSubmit}>Yes</Button>
                </Modal.Footer>
              </Modal>

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
