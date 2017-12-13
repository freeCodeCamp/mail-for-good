import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import FontAwesome from 'react-fontawesome';
import ManageTemplatesTable from '../../components/templates/ManageTemplatesTable';
import { getTemplates, deleteTemplates } from '../../actions/campaignActions';
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

const mapDispatchToProps = { getTemplates, deleteTemplates, notify };

export class ManageTemplatesComponent extends Component {

  static propTypes = {
    form: PropTypes.object,
    getTemplates: PropTypes.func.isRequired,
    templates: PropTypes.array.isRequired,
    isGetting: PropTypes.bool.isRequired,
    deleteTemplates: PropTypes.func.isRequired,
    notify: PropTypes.func.isRequired
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  constructor() {
    super();
    this.deleteRows = this.deleteRows.bind(this);
    this.getTemplateView = this.getTemplateView.bind(this);
  }

  componentDidMount() {
    this.props.getTemplates();
  }

  deleteRows(templateIds) { // templateIds [...Numbers]
    this.props.deleteTemplates(templateIds, this.props.templates);
  }

  getTemplateView(row) {
    // Send user to the campaign view container
    this.context.router.push(`/templates/manage/${row.slug}`);
  }

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
              <ManageTemplatesTable data={this.props.templates} deleteRows={this.deleteRows} getTemplateView={this.getTemplateView}/>
            </div>
            {this.props.isGetting && <div className="overlay">
              <FontAwesome name="refresh" spin/>
            </div>}
          </div>
        </section>

      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageTemplatesComponent);