import React, { PropTypes } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table.min.css';
import moment from 'moment';

// Ref: https://allenfang.github.io/react-bootstrap-table/docs.html
const ManageTemplatesTable = ({ data, deleteRows, getTemplatesView }) => {
  
  const selectRowProp = {
    mode: "checkbox",
    bgColor: "rgb(176, 224, 230)"
  };

  const options = {
    clearSearch: true,
    noDataText: 'You do not have any templates linked with your account',
    onRowClick: row => { // This fires on clicking a row. TODO: Needs to go to another route with the format /:[campaign-name-slug] where users can manage (edit, send, schedule, delete) the campaign
      // NOTE: Row is an object where keys are data fields
      getCampaignView(row);
    },
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
      exportCSV={true}>

      <TableHeaderColumn dataField="id" hidden={true} isKey={true}>Id</TableHeaderColumn>
      <TableHeaderColumn dataField="slug" hidden={true}>Slug</TableHeaderColumn>
      <TableHeaderColumn dataField="name" dataAlign="center" dataSort={true}>Name</TableHeaderColumn>
      <TableHeaderColumn dataField="campaignanalytic.totalSentCount" dataAlign="center" dataSort={true} csvHeader="sent">Sent</TableHeaderColumn>
      <TableHeaderColumn dataField="delivered" dataAlign="center" dataSort={true} dataFormat={deliveredFormatter} csvFormat={deliveredFormatter}>Delivered</TableHeaderColumn>
      <TableHeaderColumn dataField="bounced" dataAlign="center" dataSort={true} dataFormat={bouncedFormatter} csvFormat={bouncedFormatter}>Bounced</TableHeaderColumn>
      <TableHeaderColumn dataField="campaignanalytic.complaintCount" dataAlign="center" dataSort={true} csvHeader="complaints">Complaints</TableHeaderColumn>
      <TableHeaderColumn dataField="campaignanalytic.clickthroughCount" dataAlign="center" dataSort={true} csvHeader="clickthroughs">Clickthroughs</TableHeaderColumn>
      <TableHeaderColumn dataField="campaignanalytic.openCount" dataAlign="center" dataSort={true} csvHeader="opens">Opens</TableHeaderColumn>
      <TableHeaderColumn export ={false} dataAlign="center" width="100">Tags (WIP)</TableHeaderColumn>
      <TableHeaderColumn dataField="createdAt" dataAlign="center" dataSort={true} dataFormat={dateFormatter} width="150">Created</TableHeaderColumn>
      <TableHeaderColumn dataField="updatedAt" dataAlign="center" dataSort={true} dataFormat={dateFormatter} width="150">Updated</TableHeaderColumn>

    </BootstrapTable>
  );
};

ManageTemplatesTable.propTypes = {
  data: PropTypes.array.isRequired,
  deleteRows: PropTypes.func.isRequired,
  getTemplateView: PropTypes.func.isRequired
};

export default ManageTemplatesTable;
