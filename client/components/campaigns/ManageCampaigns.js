import React from 'react';
import ManageCampaignsBox from '../../containers/campaigns/ManageCampaignsBox';

const ManageCampaigns = () => {
  return (
    <div>
      <div className="content-header">
        <h1>Manage campaigns
          <small>Edit or delete your campaigns here</small>
        </h1>
      </div>

      <section className="content">
        <ManageCampaignsBox />
      </section>
    </div>
  );
};

export default ManageCampaigns;
