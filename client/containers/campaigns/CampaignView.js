import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import FontAwesome from 'react-fontawesome';
import { Modal, Button } from 'react-bootstrap';
import { getCampaigns, postSendCampaign, postTestEmail, stopSending } from '../../actions/campaignActions';
import { notify } from '../../actions/notificationActions';
import PreviewCampaignForm from '../../components/campaigns/PreviewCampaignForm';

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

@connect(mapStateToProps, { getCampaigns, postSendCampaign, postTestEmail, stopSending, notify })
export default class CampaignView extends Component {

  static propTypes = {
    // actions
    postSendCampaign: PropTypes.func.isRequired,
    postTestEmail: PropTypes.func.isRequired,
    getCampaigns: PropTypes.func.isRequired,
    stopSending: PropTypes.func.isRequired,
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
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.sendTestEmail = this.sendTestEmail.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  state = {
    thisCampaign: {},
    showModal: false,
    haveShownMessage: false,
    testEmail: ''
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
    const getCampaignBySlug = props.campaigns.find(campaign => campaign.slug === slug);
    this.setState({
      thisCampaign: getCampaignBySlug
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

  sendTestEmail() {
    // Get the test email & campaignId then dispatch to the action controller
    const { testEmail, thisCampaign: { id: campaignId } } = this.state;
    if (!testEmail) {
      this.props.notify({ message: 'Please provide an email' });
      return;
    }
    const form = { testEmail, campaignId };
    this.props.postTestEmail(JSON.stringify(form));
    this.props.notify({ message: 'Your test email has been sent', colour: 'green' });
    this.setState({ testEmail: '' });
  }

  stopSending() {
    this.props.stopSending(this.state.thisCampaign.id);
  }

  handleChange(e) {
    this.setState({
      [e.target.id]: e.target.value
    });
  }

  render() {
    let downloadUnsentSubscribersUrl = encodeURI(`${window.location.origin}/api/campaign/subscribers/csv?campaignId=${this.state.thisCampaign.id}&sent=false`);
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

              <PreviewCampaignForm campaignView={this.state.thisCampaign} />

              <div className="form-inline">
                <button className="btn btn-success btn-lg" type="button" onClick={this.open}>Send</button>
                <button style={{ "margin-left": "1rem" }} className="btn btn-info" type="button" onClick={this.sendTestEmail}>Send a test email</button>
                <input id="testEmail" style={{ "margin-left": "1rem" }} className="form-control" placeholder="Send a test email to:" type="email" value={this.state.testEmail} onChange={this.handleChange} />
                <br/>
                <button className="btn btn-lg btn-primary" onClick={() => {window.location = downloadUnsentSubscribersUrl}}>Export unsent</button>
                <button className="btn btn-danger btn-lg" type="button" onClick={this.stopSending.bind(this)}>Stop sending</button>
              </div>

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
