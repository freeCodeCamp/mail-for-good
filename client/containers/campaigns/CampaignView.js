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
    // SendCampaign state
    isPostingSendCampaign: state.sendCampaign.isPosting,
    sendCampaignResponse: state.sendCampaign.sendCampaignResponse,
    sendCampaignStatus: state.sendCampaign.sendCampaignStatus,
    // SendTest state
    isPostingSendTest: state.sendTest.isPosting,
    sendTestEmailResponse: state.sendTest.sendTestEmailResponse,
    sendTestEmailStatus: state.sendTest.sendTestEmailStatus
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

    isPostingSendCampaign: PropTypes.bool.isRequired,
    sendCampaignResponse: PropTypes.string.isRequired,
    sendCampaignStatus: PropTypes.number.isRequired,

    isPostingSendTest: PropTypes.bool.isRequired,
    sendTestEmailResponse: PropTypes.string.isRequired,
    sendTestEmailStatus: PropTypes.number.isRequired,
    // route path
    params: PropTypes.object.isRequired
  }

  constructor() {
    super();
    this.openSendModal = this.openSendModal.bind(this);
    this.closeSendModal = this.closeSendModal.bind(this);
    this.openTestSendModal = this.openTestSendModal.bind(this);
    this.closeTestSendModal = this.closeTestSendModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.sendTestEmail = this.sendTestEmail.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  state = {
    // Object containing info for this campaign
    thisCampaign: {},
    // Modals open/closed
    showSendModal: false,
    showTestSendModal: false,
    // Rest
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
    // Show success/failure toast for send campaign
    if (props.sendCampaignResponse && !props.isPostingSendCampaign) {
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

    // Show success/failure toast for send test
    if (props.sendTestEmailResponse && !props.isPostingSendTest) {
      this.setState({ haveShownMessage: true });
      if (props.sendTestEmailStatus === 200) {
        this.props.notify({
          message: 'Your test email is being sent',
          colour: 'green'
        });
      } else {
        this.props.notify({
          message: props.sendTestEmailResponse
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
    this.closeSendModal();
  }

  openSendModal() {
    this.setState({
      showSendModal: true
    });
  }

  closeSendModal() {
    this.setState({
      showSendModal: false
    });
  }

  openTestSendModal() {
    this.setState({
      showTestSendModal: true
    });
  }

  closeTestSendModal() {
    this.setState({
      showTestSendModal: false
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
    this.setState({
      testEmail: ''
    });
    this.closeTestSendModal();
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
                  <i className={this.props.sendCampaignStatus === 200 ? 'fa fa-check' : 'fa fa-exclamation'}/> {this.props.sendCampaignResponse.split('.')[0]}.<br/> <br/> {this.props.sendCampaignResponse.split('.')[1]}.
                </p>}

              <PreviewCampaignForm campaignView={this.state.thisCampaign} />

              <div className="form-inline">
                <button className="btn btn-success btn-lg" type="button" onClick={this.openSendModal}>Send</button>
                <button className="btn btn-info btn-lg" style={{ "margin-left": "1rem" }} type="button" onClick={this.openTestSendModal}>Send a test email</button>
                <button className="btn btn-lg btn-primary" style={{ "margin-left": "1rem" }} onClick={() => {window.location = downloadUnsentSubscribersUrl;}}>Export unsent</button>
                <button className="btn btn-danger btn-lg" style={{ "margin-left": "1rem" }} type="button" onClick={this.stopSending.bind(this)}>Stop sending</button>
              </div>

              {/* Modal for sending test emails */}
              <Modal show={this.state.showTestSendModal} onHide={this.closeTestSendModal}>
                <Modal.Header closeButton>
                  <Modal.Title>Send a test email</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                  <input className="form-control" style={{ "margin-left": "1rem" }} id="testEmail" placeholder="Send a test email to:" type="email" value={this.state.testEmail} onChange={this.handleChange} />
                </Modal.Body>

                <Modal.Footer>
                  <Button onClick={this.closeTestSendModal}>Cancel</Button>
                  <Button bsStyle="primary" onClick={this.sendTestEmail}>Send Test Email</Button>
                </Modal.Footer>
              </Modal>

              {/* Modal for sending email campaign */}
              <Modal show={this.state.showSendModal} onHide={this.closeSendModal}>
                <Modal.Header closeButton>
                  <Modal.Title>Are you ready to send this campaign to {this.state.thisCampaign.totalCampaignSubscribers.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} subscribers?</Modal.Title>
                </Modal.Header>

                <Modal.Footer>
                  <Button onClick={this.closeSendModal}>No</Button>
                  <Button bsStyle="primary" onClick={this.handleSubmit}>Yes</Button>
                </Modal.Footer>
              </Modal>

              {this.props.isGetting || this.props.isPostingSendCampaign || this.props.isPostingSendTest && <div className="overlay">
                <FontAwesome name="refresh" spin/>
              </div>}
            </div>
          </div>
        </section>
      </div>
    );
  }
}
