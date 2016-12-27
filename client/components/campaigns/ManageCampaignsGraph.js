import React, { PropTypes } from 'react';
import ReactHighCharts from 'react-highcharts';


export default class ManageCampaignsGraph extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: this.props.data || []
    }
  }

  static propTypes = {
    data: PropTypes.array.isRequired
  }

  componentWillReceiveProps(props) {
    this.setState({
      data: props.data
    });
  }

  render() {
    let sentData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let deliveredData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let complaintData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let bounceData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    this.state.data.forEach(campaign => {
      const monthUTC = campaign.createdAt.getUTCMonth();
      sentData[monthUTC] += campaign['campaignanalytic.totalSentCount'];
      complaintData[monthUTC] += campaign['campaignanalytic.complaintCount'];
      bounceData[monthUTC] += campaign['campaignanalytic.permanentBounceCount'];

      deliveredData[monthUTC] += campaign['campaignanalytic.totalSentCount'] -
        campaign['campaignanalytic.permanentBounceCount'] -
        campaign['campaignanalytic.transientBounceCount'];;
    })

    var config = {
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
        { name: 'Sent', data: sentData },
        { name: 'Complaint', data: complaintData },
        { name: 'Delivered', data: deliveredData },
        { name: 'Bounced', data: bounceData }
        ]
    };

    return (
      <ReactHighCharts config={config} />
    )
  }
}
