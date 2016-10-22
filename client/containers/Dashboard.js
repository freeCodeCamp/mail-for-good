import React from 'react';
import ManageCampaignsBox from './campaigns/ManageCampaignsBox';
import ManageListsBox from './lists/ManageListsBox';

export default class Home extends React.Component {
  render() {
    return (
      <div>
        <section className="content-header">
          <h1>Dashboard <small>An overview of your lists and campaigns</small></h1>
        </section>
        <section className="content">

          <ManageCampaignsBox />
          <ManageListsBox />

        </section>
      </div>
    );
  }
}

Home.propTypes = {
  children: React.PropTypes.element
};
