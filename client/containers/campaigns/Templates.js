import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import CreateCampaignForm from '../../components/campaigns/CreateCampaignForm';
import PreviewCampaignForm from '../../components/campaigns/PreviewCampaignForm';
import { postCreateTemplate } from '../../actions/campaignActions';
import FontAwesome from 'react-fontawesome';
import CreateTemplateForm from '../../components/campaigns/CreateTemplateForm';

function mapStateToProps(state) {
  // State reducer @ state.form & state.createCampaign & state.manageLists
  return {
    form: state.form.createTemplate,
    isPosting: state.createTemplate.isPosting
  };
}

@connect(mapStateToProps, { postCreateTemplate })
export default class Templates extends Component {
  render() {
    return (
      <div>
        <div className="content-header">
          <h1>Templates
            <small>Create and manage your templates</small>
          </h1>
        </div>

        <section className="content">
          <div className="box box-primary">
            <div className="box-body">
              <CreateTemplateForm />
            </div>
          </div>
        </section>

      </div>
    );
  }
}
