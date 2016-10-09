import React, { PropTypes } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import BSTyle from 'react-bootstrap-table/dist/react-bootstrap-table.min.css';
import moment from 'moment';

// Ref: https://allenfang.github.io/react-bootstrap-table/docs.html
const ManageCampaignsTable = (props) => {
  const { data, deleteRows } = props;

  const selectRowProp = {
    mode: "checkbox",
    bgColor: "rgb(176, 224, 230)"
  };

  const options = {
    clearSearch: true,
    noDataText: 'You do not have any campaigns linked with your account',
    onRowClick: campaignId => { // This fires on clicking a row. TODO: Needs to go to another route with the format /:[campaign-name-slug] where users can manage (edit, send, schedule, delete) the campaign
      // NOTE: campaignId is the primary key of a campaign instance
    },
    afterDeleteRow: rows => { // Optimistic update, can assume request will succeed. 'Rows' has format [...rowKey] where rowKey is a list primary key
      deleteRows(rows);
    },
    handleConfirmDeleteRow: next => {next()} // By default, react-bootstrap-table confirms choice using an alert. We want to override that behaviour.
  };

  const dateFormatter = cell => {
    return moment(cell).format('lll');
  };

  // ID will be used as the rowKey, but the column itself is hidden as it has no value
  return (
    <BootstrapTable data={data}
      pagination={true}
      hover={true}
      deleteRow={true}
      selectRow={selectRowProp}
      options={options}
      search={true}
      searchPlaceholder="Filter campaigns"
      clearSearch={true}>

      <TableHeaderColumn dataField="id" dataAlign="center" hidden={true} isKey={true}>Id</TableHeaderColumn>
      <TableHeaderColumn dataField="name" dataAlign="center" dataSort={true}>Name</TableHeaderColumn>
      <TableHeaderColumn dataAlign="center" width="300">Tags (WIP)</TableHeaderColumn>
      <TableHeaderColumn dataField="createdAt" dataAlign="center" dataSort={true} dataFormat={dateFormatter} width="150">Created</TableHeaderColumn>
      <TableHeaderColumn dataField="updatedAt" dataAlign="center" dataSort={true} dataFormat={dateFormatter} width="150">Updated</TableHeaderColumn>
    </BootstrapTable>
  );
};

ManageCampaignsTable.propTypes = {
  data: PropTypes.array.isRequired,
  deleteRows: PropTypes.func.isRequired
};

export default ManageCampaignsTable;
