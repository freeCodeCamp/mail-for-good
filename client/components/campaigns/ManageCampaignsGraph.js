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
    let xAxis = [];
    let data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    this.state.data.forEach(campaign => {
      const monthUTC = campaign.createdAt.getUTCMonth();
      data[monthUTC] += campaign['campaignanalytic.totalSentCount'];
    })

    var config = {
      xAxis: {
        categories: months
      },
      series: [{
        data
      }]
    };

    return (
      <ReactHighCharts config={config} />
    )
  }
}
