import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import CreateCampaignForm from '../../components/campaigns/CreateCampaignForm';
import PreviewCampaignForm from '../../components/campaigns/PreviewCampaignForm';
import { postCreateCampaign } from '../../actions/campaignActions';
import { getLists } from '../../actions/listActions';
import FontAwesome from 'react-fontawesome';

function mapStateToProps(state) {
  // State reducer @ state.form & state.createCampaign & state.manageLists
  return {
    form: state.form.createCampaign,
    isPosting: state.createCampaign.isPosting,
    lists: state.manageList.lists,
    isGetting: state.manageList.isGetting
  };
}

@connect(mapStateToProps, { postCreateCampaign, getLists })
export default class CreateCampaign extends Component {

  static propTypes = {
    form: PropTypes.object,
    isPosting: PropTypes.bool.isRequired,
    postCreateCampaign: PropTypes.func.isRequired,
    getLists: PropTypes.func.isRequired,
    lists: PropTypes.array.isRequired,
    isGetting: PropTypes.bool.isRequired
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.nextPage = this.nextPage.bind(this);
    this.lastPage = this.lastPage.bind(this);
  }

  state = {
    page: 1
  }

  componentDidMount() {
    // Update lists only if we need to
    if (!this.props.lists.length) {
      this.props.getLists();
    }
  }

  componentWillReceiveProps(props) {
    if (this.props.isPosting === true && props.isPosting === false) { // Fires when campaign has been successfully created
      this.context.router.push(`/campaigns/manage`);
    }
  }

  handleSubmit() {
    // TODO: Validation both sync and serverside async for the form
    this.props.postCreateCampaign(JSON.stringify(this.props.form.values));
  }

  nextPage() {
    this.setState({ page: this.state.page + 1 });
  }

  lastPage() {
    this.setState({ page: this.state.page - 1 });
  }

  render() {
    const { page } = this.state;

    return (
      <div>
        <div className="content-header">
          <h1>Create Campaign
            <small>Create and optionally send to a new campaign</small>
          </h1>
        </div>

        <section className="content">
          <div className="box box-primary">
            <div className="box-body">
              {page === 1 && <CreateCampaignForm lists={this.props.lists} nextPage={this.nextPage} />}
              {page === 2 && <PreviewCampaignForm form={this.props.form} lastPage={this.lastPage} handleSubmit={this.handleSubmit} />}
            </div>

            {this.props.isGetting || this.props.isPosting && <div className="overlay">
              <FontAwesome name="refresh" spin/>
            </div>}
          </div>
        </section>

      </div>
    );
  }
}
