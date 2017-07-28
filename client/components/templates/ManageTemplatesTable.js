import React, { PropTypes } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import moment from 'moment';

// Ref: https://allenfang.github.io/react-bootstrap-table/docs.html
const ManageTemplatesTable = ({ data, deleteRows, getTemplateView }) => {

  const selectRowProp = {
    mode: "checkbox",
    bgColor: "rgb(176, 224, 230)"
  };

  const options = {
    clearSearch: true,
    noDataText: 'You do not have any templates linked with your account',
    onRowClick: row => { // This fires on clicking a row. TODO: Needs to go to another route with the format /:[campaign-name-slug] where users can manage (edit, send, schedule, delete) the campaign
      // NOTE: Row is an object where keys are data fields
      getTemplateView(row);
    },
    afterDeleteRow: rows => { // Optimistic update, can assume request will succeed. 'Rows' has format [...rowKey] where rowKey is a list primary key
      deleteRows(rows);
    },

    handleConfirmDeleteRow: next => { 
    if (confirm('Are you sure that you want to delete the selected template(s)?')) 
      next();
    } 
  };

  const dateFormatter = cell => {
    return moment(cell).format('lll');
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
      searchPlaceholder="Filter templates"
      clearSearch={true}>

      <TableHeaderColumn dataField="id" hidden={true} isKey={true}>Id</TableHeaderColumn>
      <TableHeaderColumn dataField="name" dataAlign="center" dataSort={true}>Name</TableHeaderColumn>
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
