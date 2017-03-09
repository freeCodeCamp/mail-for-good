import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import ManageCampaignsBox from './campaigns/ManageCampaignsBox';
import ManageListsBox from './lists/ManageListsBox';
import UserInfo from '../components/dashboard/UserInfo';

function mapStateToProps(state) {
  return {
    user: state.profile.user,
    campaigns: state.manageCampaign.campaigns
  };
}

export class Dashboard extends Component {
  render() {
    const totalSentCount = this.props.campaigns.reduce((total, campaign) => total + campaign['campaignanalytic.totalSentCount'], 0);

    return (
      <div>
        <section className="content-header">
          <h1>Dashboard <small>An overview of your lists and campaigns</small></h1>
        </section>
        <section className="content">

          <UserInfo user={this.props.user} totalSentCount={totalSentCount} />
          <ManageCampaignsBox />
          <ManageListsBox />

        </section>
      </div>
    );
  }
}

Dashboard.propTypes = {
  children: PropTypes.element,
  user: PropTypes.object
};

export default connect(mapStateToProps)(Dashboard);