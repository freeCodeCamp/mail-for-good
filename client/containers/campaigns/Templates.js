import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import FontAwesome from 'react-fontawesome';
import CreateTemplateForm from '../../components/campaigns/CreateTemplateForm';
import PreviewTemplateForm from '../../components/campaigns/PreviewTemplateForm';
import ManageTemplatesTable from '../../components/campaigns/ManageTemplatesTable';
import { getTemplates, postCreateTemplate } from '../../actions/campaignActions';

function mapStateToProps(state) {
  // State reducer @ state.form.createTemplate & state.createTemplate
  return {
    form: state.form.createTemplate,
    isPosting: state.createTemplate.isPosting
  };
}

@connect(mapStateToProps, { postCreateTemplate })
export default class Templates extends Component {

  static propTypes = {
    form: PropTypes.object,
    isPosting: PropTypes.bool.isRequired,
    postCreateTemplate: PropTypes.func.isRequired
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
    page: 1,
    initialFormValues: {
      type: 'Plaintext'
    }
  }

  componentWillReceiveProps(props) {
    if (this.props.isPosting === true && props.isPosting === false) { // Fires when template has been successfully created
      this.context.router.push(`/campaigns/create`);
    }
  }

  handleSubmit() {
    console.log(this.props);
    this.props.postCreateTemplate(JSON.stringify(this.props.form.values));
  }

  nextPage() {
    this.setState({ page: this.state.page + 1 });
  }

  lastPage() {
    this.setState({ page: this.state.page - 1 });
  }

  deleteRows(templateIds) { // campaignIds [...Numbers]
    const jsonCampaignIds = JSON.stringify({data: templateIds});
    //this.props.deleteCampaigns(jsonCampaignIds);
  }

  render() {
    const { page } = this.state;

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
            <ManageTemplatesTable data={this.props.campaigns} deleteRows={this.deleteRows} />
          </div>
        </div>

          <div className="box box-primary">
            <div className="box-body">
              {page === 1 && <CreateTemplateForm nextPage={this.nextPage} initialValues={this.state.initialFormValues} />}
              {page === 2 && <PreviewTemplateForm form={this.props.form} lastPage={this.lastPage} handleSubmit={this.handleSubmit} />}
            </div>
          </div>

          {this.props.isPosting && <div className="overlay">
            <FontAwesome name="refresh" spin/>
          </div>}
        </section>

      </div>
    );
  }
}
