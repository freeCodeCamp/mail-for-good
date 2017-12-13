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

const mapDispatchToProps = { getCampaigns, postSendCampaign, postTestEmail, stopSending, notify };

export class CampaignViewComponent extends Component {

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

  componentWillReceiveProps(nextProps) {
    // Set thisCampaign from campaigns once we have it
    if (nextProps.campaigns && nextProps.campaigns.length && !this.props.campaigns.length) { // Guarded and statement that confirms campaigns is in the new props, confirms the array isn't empty, and then confirms that current props do not exist
      this.getSingleCampaign(nextProps);
    }

    // Show success/failure toast for send campaign
    const sendCampaignResponseExists = !!nextProps.sendCampaignResponse;
    const justSentCampaign = !nextProps.isPostingSendCampaign && this.props.isPostingSendCampaign;
    if (sendCampaignResponseExists && justSentCampaign) {
      this.setState({ haveShownMessage: true });
      if (nextProps.sendCampaignStatus === 200) {
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
    const sendTestEmailResponseExists = !!nextProps.sendTestEmailResponse;
    const justSentTestEmail = !nextProps.isPostingSendTest && this.props.isPostingSendTest;
    if (sendTestEmailResponseExists && justSentTestEmail) {
      this.setState({ haveShownMessage: true });
      if (nextProps.sendTestEmailStatus === 200) {
        this.props.notify({
          message: 'Your test email is being sent',
          colour: 'green'
        });
      } else {
        this.props.notify({
          message: nextProps.sendTestEmailResponse
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
    const {
      thisCampaign,
      haveShownMessage,
      showTestSendModal,
      testEmail
    } = this.state;

    const {
      sendCampaignResponse,
      sendCampaignStatus,
      isPostingSendCampaign,
      isPostingSendTest,
      isGetting
    } = this.props;

    const downloadUnsentSubscribersUrl = encodeURI(`${window.location.origin}/api/campaign/subscribers/csv?campaignId=${thisCampaign.id}&sent=false`);
    const status = thisCampaign.status;

    const renderCampaignView = () => (
      <div>
        <div className="content-header">
          <h1>Your Campaign
            <small>View and send your campaign</small>
          </h1>
        </div>

        <section className="content">
          <div className="box box-primary">
            <div className="box-header">
              <h3 className="box-title">Campaign: {thisCampaign.name}</h3>
            </div>

            <div className="box-body">

              {(sendCampaignResponse && haveShownMessage) &&
                <p className={sendCampaignStatus === 200 ? 'text-green' : 'text-red'}>
                  <i className={sendCampaignStatus === 200 ? 'fa fa-check' : 'fa fa-exclamation'}/> {sendCampaignResponse.split('.')[0]}.<br/> <br/> {sendCampaignResponse.split('.')[1]}.
                </p>}

              <PreviewCampaignForm campaignView={thisCampaign} />

              <div className="form-inline">
                <button disabled={!['ready', 'interrupted'].includes(status)} className="btn btn-success btn-lg" type="button" onClick={this.openSendModal}>Send</button>
                <button className="btn btn-info btn-lg" style={{ "marginLeft": "1rem" }} type="button" onClick={this.openTestSendModal}>Send a test email</button>
                <button className="btn btn-lg btn-primary" style={{ "marginLeft": "1rem" }} onClick={() => {window.location = downloadUnsentSubscribersUrl;}}>Export unsent</button>
                <button disabled={status !== 'sending'} className="btn btn-danger btn-lg" style={{ "marginLeft": "1rem" }} type="button" onClick={this.stopSending.bind(this)}>Stop sending</button>
              </div>

              {/* Modal for sending test emails */}
              <Modal show={showTestSendModal} onHide={this.closeTestSendModal}>
                <Modal.Header closeButton>
                  <Modal.Title>Send a test email</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                  <input className="form-control" style={{ "marginLeft": "1rem" }} id="testEmail" placeholder="Send a test email to:" type="email" value={testEmail} onChange={this.handleChange} />
                </Modal.Body>

                <Modal.Footer>
                  <Button onClick={this.closeTestSendModal}>Cancel</Button>
                  <Button bsStyle="primary" onClick={this.sendTestEmail}>Send Test Email</Button>
                </Modal.Footer>
              </Modal>

              {/* Modal for sending email campaign */}
              <Modal show={this.state.showSendModal} onHide={this.closeSendModal}>
                <Modal.Header closeButton>
                  <Modal.Title>Are you ready to send this campaign to {thisCampaign.totalCampaignSubscribers ? thisCampaign.totalCampaignSubscribers.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0} subscribers?</Modal.Title>
                </Modal.Header>

                <Modal.Footer>
                  <Button onClick={this.closeSendModal}>No</Button>
                  <Button bsStyle="primary" onClick={this.handleSubmit}>Yes</Button>
                </Modal.Footer>
              </Modal>

              {isGetting || isPostingSendCampaign || isPostingSendTest && <div className="overlay">
                <FontAwesome name="refresh" spin/>
              </div>}
            </div>
          </div>
        </section>
      </div>
    );

    const canRender = !!(thisCampaign);

    return (
      <div>
        {canRender && renderCampaignView()}
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CampaignViewComponent);
