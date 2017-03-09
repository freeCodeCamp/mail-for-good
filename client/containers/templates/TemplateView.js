import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import FontAwesome from 'react-fontawesome';
import { notify } from '../../actions/notificationActions';
import { getTemplates } from '../../actions/campaignActions';
import PreviewTemplateForm from '../../components/templates/PreviewTemplateForm';

function mapStateToProps(state) {
  // State reducer @ state.manageCampaign
  return {
    templates: state.manageTemplates.templates,
    isGetting: state.manageTemplates.isGetting,
  };
}

const mapDispatchToProps = { notify, getTemplates };

export class TemplateViewComponent extends Component {

  static propTypes = {
    notify: PropTypes.func.isRequired,
    getTemplates: PropTypes.func.isRequired,
    // redux
    templates: PropTypes.array.isRequired,
    isGetting: PropTypes.bool.isRequired,
    // route path
    params: PropTypes.object.isRequired
  }

  state = {
    thisTemplate: {}
  }

  componentWillMount() {
    this.props.getTemplates();
    this.getSingleTemplate(this.props);
  }

  componentWillReceiveProps(props) {
    // Set thisCampaign from campaigns once we have it
    if (props.templates && props.templates.length && !this.props.templates.length) { // Guarded and statement that confirms campaigns is in the new props, confirms the array isn't empty, and then confirms that current props do not exist
      this.getSingleTemplate(props);
    }
  }

  getSingleTemplate(props) {
    // This method retrieves a single campaign from this.props.campaigns based on the parameter in the url
    const slug = this.props.params.slug;
    const getTemplateBySlug = props.templates.find(template => template.slug === slug);
    this.setState({
      thisTemplate: getTemplateBySlug
    });
  }

  render() {
    return (
      <div>
        <div className="content-header">
          <h1>Your Template
            <small>View your template</small>
          </h1>
        </div>

        <section className="content">
          <div className="box box-primary">
            <div className="box-header">
              <h3 className="box-title">Templates: {this.state.thisTemplate.name}</h3>
            </div>

            <div className="box-body">

              <PreviewTemplateForm templateView={this.state.thisTemplate} />

              {this.props.isGetting && <div className="overlay">
                <FontAwesome name="refresh" spin/>
              </div>}
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TemplateViewComponent);