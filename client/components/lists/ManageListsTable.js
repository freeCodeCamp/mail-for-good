import React, { PropTypes } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Link } from 'react-router';
import moment from 'moment';

const ManageListsTable = ({ data, deleteRows }) => {

  const selectRowProp = {
    mode: "checkbox",
    bgColor: "rgb(176, 224, 230)"
  };

  const options = {
    clearSearch: true,
    noDataText: 'You do not have any lists linked with your account',
    afterDeleteRow: rows => { // Optimistic update, can assume request will succeed. 'Rows' has format [...rowKey] where rowKey is a list primary key
      deleteRows(rows);
    },
    handleConfirmDeleteRow: next => { next(); } // By default, react-bootstrap-table confirms choice using an alert. We want to override that behaviour.
  };

  const formatFieldDate = cell => moment(cell).format('lll');

  const formatFieldManageSubscribers = (cell, row) => (
      <Link to={`/lists/manage/${row.id}`}>
      <button type="button" className="btn btn-default btn-flat">
          <i className="fa fa-user" />
      </button>
      </Link>
  );

  return (
    <BootstrapTable data={data}
      pagination={true}
      hover={true}
      deleteRow={true}
      selectRow={selectRowProp}
      options={options}
      search={true}
      searchPlaceholder="Filter lists"
      clearSearch={true}>

      <TableHeaderColumn dataField="id" hidden={true} isKey={true}>id</TableHeaderColumn>
      <TableHeaderColumn dataField="name" dataSort={true}>Name</TableHeaderColumn>
      <TableHeaderColumn dataField="subscribeKey" dataSort={true}>Subscription Key</TableHeaderColumn>
      <TableHeaderColumn dataField="createdAt" dataSort={true} dataFormat={formatFieldDate}>Created</TableHeaderColumn>
      <TableHeaderColumn dataField="updatedAt" dataSort={true} dataFormat={formatFieldDate}>Updated</TableHeaderColumn>
      <TableHeaderColumn dataAlign="center" width="150" dataFormat={formatFieldManageSubscribers}>Subscribers</TableHeaderColumn>
    </BootstrapTable>
  );
};

ManageListsTable.propTypes = {
  data: PropTypes.array.isRequired,
  deleteRows: PropTypes.func.isRequired
};

export default ManageListsTable;
