import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import FontAwesome from 'react-fontawesome';
import CreateTemplateForm from '../../components/templates/CreateTemplateForm';
import PreviewTemplateForm from '../../components/templates/PreviewTemplateForm';
import { postCreateTemplate } from '../../actions/campaignActions';
import { notify } from '../../actions/notificationActions';
import moment from 'moment';

function mapStateToProps(state) {
  // State reducer @ state.form.createTemplate & state.createTemplate
  return {
    form: state.form.createTemplate,
    isPosting: state.createTemplate.isPosting,
    templates: state.manageTemplates.templates,
    isGetting: state.manageTemplates.isGetting
  };
}

const mapDispatchToProps = { postCreateTemplate, notify };

export class CreateTemplateComponent extends Component {

  static propTypes = {
    form: PropTypes.object,
    isPosting: PropTypes.bool.isRequired,
    postCreateTemplate: PropTypes.func.isRequired,
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
    this.passResetToState = this.passResetToState.bind(this);
  }

  state = {
    page: 1,
    initialFormValues: {
      templateName: `Template - ${moment().format('l, h:mm:ss')}`,
      type: 'Plaintext'
    },
    editor: '',
    reset: null
  }

  componentWillReceiveProps(props) {
    if (this.props.isPosting === true && props.isPosting === false) { // Fires when template has been successfully created
      this.setState({ page: 1 });
      this.props.notify({
        message: 'Your template was created successfully',
        colour: 'green'
      });
    }
  }

  handleSubmit() {
    this.props.postCreateTemplate(JSON.stringify(this.props.form.values), this.state.reset);
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

  passResetToState(reset) {
    this.setState({ reset });
  }

  render() {
    const { page } = this.state;
    const type = (this.props.form && this.props.form.values.type) || this.state.initialFormValues.type;

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
              {page === 1 && <CreateTemplateForm passResetToState={this.passResetToState} textEditorType={type} validationFailed={this.validationFailed} nextPage={this.nextPage} initialValues={this.state.initialFormValues} />}
              {page === 2 && <PreviewTemplateForm form={this.props.form} lastPage={this.lastPage} handleSubmit={this.handleSubmit} submitting={this.props.isPosting} />}
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

export default connect(mapStateToProps, mapDispatchToProps)(CreateTemplateComponent);
