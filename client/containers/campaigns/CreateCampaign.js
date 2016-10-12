import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import CreateCampaignForm from '../../components/campaigns/CreateCampaignForm';
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

  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    // Update lists only if we need to
    if (!this.props.lists.length) {
      this.props.getLists();
    }
  }


  handleSubmit() {
    // TODO: Validation both sync and serverside async for the form
    this.props.postCreateCampaign(JSON.stringify(this.props.form.values));
  }

  render() {
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
              <CreateCampaignForm onSubmit={this.handleSubmit} lists={this.props.lists} />
            </div>

            {/*this.props.isGetting && <div className="overlay">
              <FontAwesome name="refresh" spin/>
            </div>*/}
          </div>
        </section>

      </div>
    );
  }
}
