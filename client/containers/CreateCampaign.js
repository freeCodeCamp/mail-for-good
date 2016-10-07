import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import CreateCampaignForm from '../components/campaigns/CreateCampaignForm';

function mapStateToProps(state) {
  // State reducer @ state.form
  return {form: state.form.createCampaign};
}

@connect(mapStateToProps, null)
export default class CreateList extends Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  static propTypes = {
    form: PropTypes.object.isRequired
  }

  handleSubmit(form) {
    console.log(this.props.form)
    console.log(form);
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
