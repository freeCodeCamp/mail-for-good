import React, { PropTypes } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import BSTyle from 'react-bootstrap-table/dist/react-bootstrap-table.min.css';

// Ref: https://allenfang.github.io/react-bootstrap-table/docs.html
const ManageCampaignsTable = (props) => {
  const { data } = props;

  const options = {
    afterDeleteRow: rows => { // Optimistic update, can assume request will succeed
      console.log(rows)
    },
    handleConfirmDeleteRow: next => {next()} // By default, react-bootstrap-table confirms choice using an alert. We want to override that behaviour.
  };

  return (
    <BootstrapTable data={data} striped={true} pagination={true} hover={true} deleteRow={true} selectRow={selectRowProp} options={options}>
      <TableHeaderColumn dataField="name" isKey={true} dataAlign="center" dataSort={true}>Name</TableHeaderColumn>
      <TableHeaderColumn dataField="createdAt" dataSort={true}>Created</TableHeaderColumn>
      <TableHeaderColumn dataField="updatedAt">Updated</TableHeaderColumn>
    </BootstrapTable>
  );
};

ManageCampaignsTable.propTypes = {

};

export default ManageCampaignsTable;
