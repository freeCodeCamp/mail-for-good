import React, { PropTypes } from 'react';
import ReactHighCharts from 'react-highcharts';

const ManageCampaignsGraph = props => {
  const data = props.data || [];

  let sentData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  let deliveredData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  let complaintData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  let bounceData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  data.forEach(campaign => {
    const monthUTC = campaign.createdAt.getUTCMonth();
    sentData[monthUTC] += campaign['campaignanalytic.totalSentCount'];
    complaintData[monthUTC] += campaign['campaignanalytic.complaintCount'];
    bounceData[monthUTC] += campaign['campaignanalytic.permanentBounceCount'];

    deliveredData[monthUTC] += campaign['campaignanalytic.totalSentCount'] -
      campaign['campaignanalytic.permanentBounceCount'] -
      campaign['campaignanalytic.transientBounceCount'];
  });

  const config = {
    title: {
      text: 'Campaign Stats'
    },
    xAxis: {
      title: { text: 'Date' },
      categories: months
    },
    yAxis: {
      title: {
        text: 'Emails'
      },
      min: 0
    },
    series: [
      { name: 'Sent', data: sentData, zIndex: 3, legendIndex: 0, color: '#7cb5ec' },
      { name: 'Delivered', data: deliveredData, zIndex: 2, legendIndex: 1, color: '#2b908f' },
      { name: 'Complaint', data: complaintData, zIndex: 1, legendIndex: 2, color: '#f7a35c' },
      { name: 'Bounced', data: bounceData, zIndex: 0, legendIndex: 3, color: '#f15c80' }
      ]
  };

  return (
    <ReactHighCharts config={config} />
  );
};

ManageCampaignsGraph.propTypes = {
  data: PropTypes.array.isRequired,
};

export default ManageCampaignsGraph;
