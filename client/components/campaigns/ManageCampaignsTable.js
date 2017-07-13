import React, { PropTypes } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import moment from 'moment';

// Ref: https://allenfang.github.io/react-bootstrap-table/docs.html
const ManageCampaignsTable = ({ data, deleteRows, getCampaignView }) => {

  const selectRowProp = {
    mode: "checkbox",
    bgColor: "rgb(176, 224, 230)"
  };

  const options = {
    clearSearch: true,
    noDataText: 'You do not have any campaigns linked with your account',
    afterDeleteRow: rows => { // Optimistic update, can assume request will succeed. 'Rows' has format [...rowKey] where rowKey is a list primary key
      deleteRows(rows);
    },
    handleConfirmDeleteRow: next => { next(); } // By default, react-bootstrap-table confirms choice using an alert. We want to override that behaviour.
  };

  const dateFormatter = cell => {
    return moment(cell).format('lll');
  };

  const countBounced = data => {
    return data["campaignanalytic.permanentBounceCount"] + data["campaignanalytic.transientBounceCount"] + data["campaignanalytic.undeterminedBounceCount"];
  };

  const bouncedFormatter = (cell, row) => {
    return countBounced(row);
  };

  const deliveredFormatter = (cell, row) => {
    const total = row['campaignanalytic.totalSentCount'];
    const failed = countBounced(row) + row['campaignanalytic.complaintCount'];

    return total - failed;
  };

  const actionButtonsFormatter = (cell, row) => {
    return (
      <a href="#" onClick={getCampaignView.bind(this, row)}>Manage</a>
    );
  };

  const clickthroughsFormatter = (cell, row) => {
    return row['trackLinksEnabled'] ? cell : 'n/a';
  };

  const opensFormatter = (cell, row) => {
    return row['trackingPixelEnabled'] ? cell : 'n/a';
  };

  const statusFormatter = status => {
    if (status == 'creating') {
      return `<span class="label label-warning">Creating</span>`;
    } else if (status == 'ready') {
      return `<span class="label label-default">Ready</span>`;
    } else if (status == 'interrupted') {
      return `<span class="label label-danger">Interrupted</span>`;
    } else if (status == 'sending') {
      return `<span class="label label-success">Sending</span>`;
    } else if (status == 'done') {
      return `<span class="label label-success">Done</span>`;
    }
  };

  const filterDate = {
    type: "DateFilter",
    //defaultValue: //Default value on filter. If type is NumberFilter or DateFilter, this value will like { number||date: xxx, comparator: '>' }
  };

  // ID will be used as the rowKey, but the column itself is hidden as it has no value. Slugs are also hidden.
  return (
    <BootstrapTable data={data}
      pagination={true}
      hover={true}
      deleteRow={true}
      selectRow={selectRowProp}
      options={options}
      search={true}
      searchPlaceholder="Filter campaigns"
      clearSearch={true}
      exportCSV={false}>

      <TableHeaderColumn dataField="id" hidden={true} isKey={true}>Id</TableHeaderColumn>
      <TableHeaderColumn dataField="slug" hidden={true}>Slug</TableHeaderColumn>
      <TableHeaderColumn dataField="name" dataAlign="center" dataSort={true} width="450">Name</TableHeaderColumn>
      <TableHeaderColumn dataAlign="center" width="150" dataFormat={actionButtonsFormatter.bind(this)}>Actions</TableHeaderColumn>
      <TableHeaderColumn dataField="status" dataAlign="center" dataSort={true} dataFormat={statusFormatter} width="150">Status</TableHeaderColumn>
      <TableHeaderColumn dataField="campaignanalytic.totalSentCount" dataAlign="center" dataSort={true} csvHeader="sent">Sent</TableHeaderColumn>
      <TableHeaderColumn dataField="delivered" dataAlign="center" dataSort={true} dataFormat={deliveredFormatter} csvFormat={deliveredFormatter}>Delivered</TableHeaderColumn>
      <TableHeaderColumn dataField="bounced" dataAlign="center" dataSort={true} dataFormat={bouncedFormatter} csvFormat={bouncedFormatter}>Bounced</TableHeaderColumn>
      <TableHeaderColumn dataField="campaignanalytic.complaintCount" dataAlign="center" dataSort={true} csvHeader="complaints">Complaints</TableHeaderColumn>
      <TableHeaderColumn dataField="campaignanalytic.clickthroughCount" dataAlign="center" dataSort={true} dataFormat={clickthroughsFormatter} csvHeader="clickthroughs">Clickthroughs</TableHeaderColumn>
      <TableHeaderColumn dataField="campaignanalytic.openCount" dataAlign="center" dataSort={true} dataFormat={opensFormatter} csvHeader="opens">Opens</TableHeaderColumn>
      {/*<TableHeaderColumn export ={false} dataAlign="center" width="100">Tags (WIP)</TableHeaderColumn>*/}
      <TableHeaderColumn dataField="createdAt" dataAlign="center" dataSort={true} dataFormat={dateFormatter} width="150" filter={filterDate}>Created</TableHeaderColumn>

    </BootstrapTable>
  );
};

ManageCampaignsTable.propTypes = {
  data: PropTypes.array.isRequired,
  deleteRows: PropTypes.func.isRequired,
  getCampaignView: PropTypes.func.isRequired
};

export default ManageCampaignsTable;
