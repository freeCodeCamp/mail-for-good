import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import FontAwesome from 'react-fontawesome';
import CreateTemplateForm from '../../components/campaigns/CreateTemplateForm';
import PreviewTemplateForm from '../../components/campaigns/PreviewTemplateForm';
import ManageTemplatesTable from '../../components/campaigns/ManageTemplatesTable';
import { getTemplates, postCreateTemplate, deleteTemplates } from '../../actions/campaignActions';

function mapStateToProps(state) {
  // State reducer @ state.form.createTemplate & state.createTemplate
  return {
    form: state.form.createTemplate,
    isPosting: state.createTemplate.isPosting,
    templates: state.manageTemplates.templates,
    isGetting: state.manageTemplates.isGetting
  };
}

@connect(mapStateToProps, { getTemplates, postCreateTemplate, deleteTemplates })
export default class Templates extends Component {

  static propTypes = {
    form: PropTypes.object,
    isPosting: PropTypes.bool.isRequired,
    postCreateTemplate: PropTypes.func.isRequired,
    getTemplates: PropTypes.func.isRequired,
    templates: PropTypes.array.isRequired,
    isGetting: PropTypes.bool.isRequired,
    deleteTemplates: PropTypes.func.isRequired
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.deleteRows = this.deleteRows.bind(this);
    this.nextPage = this.nextPage.bind(this);
    this.lastPage = this.lastPage.bind(this);
  }

  state = {
    page: 1,
    initialFormValues: {
      type: 'Plaintext'
    }
  }

  componentDidMount() {
    // Update templates only if we need to
    if (!this.props.templates.length) {
      this.props.getTemplates();
    }
  }

  componentWillReceiveProps(props) {
    if (this.props.isPosting === true && props.isPosting === false) { // Fires when template has been successfully created
      this.context.router.push(`/campaigns/create`);
    }
  }

  handleSubmit() {
    this.props.postCreateTemplate(JSON.stringify(this.props.form.values));
  }

  nextPage() {
    this.setState({ page: this.state.page + 1 });
  }

  lastPage() {
    this.setState({ page: this.state.page - 1 });
  }

  deleteRows(templateIds) { // templateIds [...Numbers]
    const jsonCampaignIds = JSON.stringify({ data: templateIds });
    this.props.deleteTemplates(jsonCampaignIds);
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
              <ManageTemplatesTable data={this.props.templates} deleteRows={this.deleteRows} />
            </div>
            {this.props.isPosting || this.props.isGetting && <div className="overlay">
              <FontAwesome name="refresh" spin/>
            </div>}
          </div>

          <div className="box box-primary">
            <div className="box-body">
              {page === 1 && <CreateTemplateForm nextPage={this.nextPage} initialValues={this.state.initialFormValues} />}
              {page === 2 && <PreviewTemplateForm form={this.props.form} lastPage={this.lastPage} handleSubmit={this.handleSubmit} />}
            </div>
            {this.props.isPosting || this.props.isGetting && <div className="overlay">
              <FontAwesome name="refresh" spin/>
            </div>}
          </div>
        </section>

      </div>
    );
  }
}
