import React, { PropTypes } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Link } from 'react-router';
import moment from 'moment';

const ManageListsTable = ({ data, deleteRows, showListSignupFormCreator, editListName }) => {

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
    handleConfirmDeleteRow: next => { 
      // We do want to prompt for confirmation on list deletion, per GitHub issue #141
      if (confirm("Do you really want to delete the selected list(s)?")) {
        next();
      }
    } 
  };

  const cellEditProps = {
    mode: 'click',
    blurToSave: true,
    //beforeSaveCell is meant to run tests and return a boolean telling if react-bootstrap-table should or not update the value of the cell
    //but because the change has to be handled with redux the change is made in beforeSaveCell and false is always returned
    beforeSaveCell:(row, cellName, cellValue)=>{
      editListName(row.id,cellValue);
      return false;
    },
  };

  const formatFieldDate = cell => moment(cell).format('lll');

  const formatFieldManageSubscribers = (cell, row) => (
      <Link to={`/lists/manage/${row.id}`}>
      <button type="button" className="btn btn-default btn-flat">
          <i className="fa fa-user" />
      </button>
      </Link>
  );

  const formatStatus = status => {
    if (status == 'processing') {
      return `<span class="label label-warning">Processing</span>`;
    } else if (status == 'ready') {
      return `<span class="label label-default">Ready</span>`;
    }
  };

  const formatSignupFormButton = (cell, row) => {
    return (
      <button onClick={() => { showListSignupFormCreator(row.subscribeKey); }}
              type="button"
              className="btn btn-default btn-flat">

        <i className="fa fa-address-card" />
      </button>
    );
  };

  const formatSubscribersTotal = (cell, row) => {
    if (row.status == 'processing') {
      return 'n/a';
    } else {
      return cell;
    }
  };

  return (
    <BootstrapTable data={data}
      pagination={true}
      hover={true}
      deleteRow={true}
      selectRow={selectRowProp}
      options={options}
      search={true}
      searchPlaceholder="Filter lists"
      clearSearch={true}
      cellEdit={cellEditProps}>

      <TableHeaderColumn dataField="id" hidden={true} isKey={true}>id</TableHeaderColumn>
      <TableHeaderColumn dataField="name" dataSort={true} editable={true}>Name</TableHeaderColumn>
      <TableHeaderColumn dataField="status" dataAlign="center" dataSort={true} dataFormat={formatStatus} editable={false} width="150">Status</TableHeaderColumn>
      <TableHeaderColumn dataField="total" dataAlign="center" dataSort={true} dataFormat={formatSubscribersTotal} editable={false} width="150">Total</TableHeaderColumn>
      <TableHeaderColumn dataField="createdAt" dataSort={true} dataFormat={formatFieldDate} editable={false}>Created</TableHeaderColumn>
      <TableHeaderColumn dataField="updatedAt" dataSort={true} dataFormat={formatFieldDate} editable={false}>Updated</TableHeaderColumn>
      <TableHeaderColumn dataAlign="center" width="150" dataFormat={formatSignupFormButton} editable={false}>Signup form</TableHeaderColumn>
      <TableHeaderColumn dataAlign="center" width="150" dataFormat={formatFieldManageSubscribers} editable={false}>Subscribers</TableHeaderColumn>
    </BootstrapTable>
  );
};

ManageListsTable.propTypes = {
  data: PropTypes.array.isRequired,
  deleteRows: PropTypes.func.isRequired,
  showListSignupFormCreator: PropTypes.func.isRequired,
  editListName: PropTypes.func.isRequired
};

export default ManageListsTable;
