import React, { PropTypes } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import moment from 'moment';

const ManageGrantOfferedPermissionsTable = ({ data, deletePermissionRows }) => {

  const selectRowProp = {
    mode: "checkbox",
    clickToSelect: true,
    bgColor: "rgb(176, 224, 230)"
  };

  /* eslint-disable */
  const createCustomDeleteButton = onClick => {
    return (
      <DeleteButton
        btnContextual='btn-danger'
        onClick={ onClick }>
            <i className="fa fa-times" aria-hidden="true" /> Delete permissions offer
      </DeleteButton>
    );
  }
  /* eslint-enable */

  const options = {
    noDataText: 'You are not offering other users permissions',
    deleteBtn: createCustomDeleteButton,
    afterDeleteRow: rows => { // Optimistic update, can assume request will succeed. 'Rows' has format [...rowKey] where rowKey is a list primary key
      deletePermissionRows(rows);
    },
    handleConfirmDeleteRow: next => { next(); } // By default, react-bootstrap-table confirms choice using an alert. We want to override that behaviour.
  };

  const formatFieldDate = cell => moment(cell).format('lll');

  return (
    <BootstrapTable data={data}
      pagination={true}
      hover={true}
      deleteRow={true}
      selectRow={selectRowProp}
      options={options}>

      <TableHeaderColumn dataField="id" hidden={true} isKey={true}>id</TableHeaderColumn>
      <TableHeaderColumn dataField="toUserEmail" dataSort={true}>Email</TableHeaderColumn>

      <TableHeaderColumn dataField="campaigns" dataSort={true}>Campaign Access</TableHeaderColumn>
      <TableHeaderColumn dataField="templates" dataSort={true}>Templates Access</TableHeaderColumn>
      <TableHeaderColumn dataField="lists" dataSort={true}>Lists Access</TableHeaderColumn>

      <TableHeaderColumn dataField="createdAt" dataSort={true} width="150" dataFormat={formatFieldDate}>Created</TableHeaderColumn>
      <TableHeaderColumn dataField="updatedAt" dataSort={true} width="150" dataFormat={formatFieldDate}>Updated</TableHeaderColumn>
    </BootstrapTable>
  );
};

ManageGrantOfferedPermissionsTable.propTypes = {
  data: PropTypes.array.isRequired,
  deletePermissionRows: PropTypes.func.isRequired
};

export default ManageGrantOfferedPermissionsTable;
