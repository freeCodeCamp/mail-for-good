import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import CreateCampaignForm from '../../components/campaigns/CreateCampaignForm';
import { postCreateCampaign } from '../../actions/campaignActions';

function mapStateToProps(state) {
  // State reducer @ state.form & state.createCampaign
  return {
    form: state.form.createCampaign,
    isPosting: state.createCampaign.isPosting
  };
}

@connect(mapStateToProps, { postCreateCampaign })
export default class CreateCampaign extends Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  static propTypes = {
    form: PropTypes.object, // Should really require this but there's no set up for initalising state atm (see http://redux-form.com/6.0.5/examples/initializeFromState/)
    isPosting: PropTypes.bool.isRequired,
    postCreateCampaign: PropTypes.func.isRequired
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
          <div className="box">
            <div className="box-body">
              <CreateCampaignForm onSubmit={this.handleSubmit}/>
            </div>
          </div>
        </section>

      </div>
    );
  }
}
