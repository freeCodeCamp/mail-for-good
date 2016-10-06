import React, {Component, PropTypes} from 'react';
import CreateCampaignForm from '../components/campaigns/CreateCampaignForm';

//@connect(null, { submitCSV })
export default class CreateList extends Component {

  static propTypes = {
    submitCSV: PropTypes.func
  }

  render() {
    return (
        <div>
            <div className="content-header">
                <h1>Create Campaign <small>Create and optionally send to a new campaign</small></h1>
            </div>

            <section className="content">
                <div className="box">
                    <div className="box-body">
                        <CreateCampaignForm />
                    </div>
                </div>
            </section>

        </div>
    );
  }

}
