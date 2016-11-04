import React, {Component, PropTypes} from 'react';
import CreateTemplateForm from '../../components/campaigns/CreateTemplateForm';

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
