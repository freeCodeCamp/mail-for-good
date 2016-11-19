import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import FontAwesome from 'react-fontawesome';
import CreateTemplateForm from '../../components/templates/CreateTemplateForm';
import PreviewTemplateForm from '../../components/templates/PreviewTemplateForm';
import { getTemplates, postCreateTemplate } from '../../actions/campaignActions';
import { notify } from '../../actions/notificationActions';

function mapStateToProps(state) {
  // State reducer @ state.form.createTemplate & state.createTemplate
  return {
    form: state.form.createTemplate,
    isPosting: state.createTemplate.isPosting,
    templates: state.manageTemplates.templates,
    isGetting: state.manageTemplates.isGetting
  };
}

@connect(mapStateToProps, { getTemplates, postCreateTemplate, notify })
export default class Templates extends Component {

  static propTypes = {
    form: PropTypes.object,
    isPosting: PropTypes.bool.isRequired,
    postCreateTemplate: PropTypes.func.isRequired,
    getTemplates: PropTypes.func.isRequired,
    templates: PropTypes.array.isRequired,
    isGetting: PropTypes.bool.isRequired,
    notify: PropTypes.func.isRequired
  }

  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.nextPage = this.nextPage.bind(this);
    this.lastPage = this.lastPage.bind(this);
    this.validationFailed = this.validationFailed.bind(this);
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
      this.setState({ page: 1 });
      this.props.notify({
        message: 'Your template was successfully created!',
        colour: 'green'
      });
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

  validationFailed(reason) {
    this.props.notify({
      message: reason
    });
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
              {page === 1 && <CreateTemplateForm validationFailed={this.validationFailed} nextPage={this.nextPage} initialValues={this.state.initialFormValues} />}
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
