import React, { PropTypes } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import moment from 'moment';

// Ref: https://allenfang.github.io/react-bootstrap-table/docs.html
const CampaignReportsTable = props => {
  const { data } = props;

  const selectRowProp = {
    mode: "checkbox",
    bgColor: "rgb(176, 224, 230)"
  };

  const options = {
    clearSearch: true,
    noDataText: 'You have not yet sent a campaign',
    onRowClick: () => { // This fires on clicking a row. TODO: Needs to go to another route with the format /:[campaign-name-slug] where users can manage (edit, send, schedule, delete) the campaign
      // NOTE: Row is an object where keys are data fields
      //getCampaignView(row);
    },
    afterDeleteRow: () => { // Optimistic update, can assume request will succeed. 'Rows' has format [...rowKey] where rowKey is a list primary key
      //deleteRows(rows);
    },
    handleConfirmDeleteRow: next => {next();} // By default, react-bootstrap-table confirms choice using an alert. We want to override that behaviour.
  };

  const dateFormatter = cell => {
    return moment(cell).format('lll');
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
      clearSearch={true}>

      <TableHeaderColumn dataField="id" hidden={true} isKey={true}>Id</TableHeaderColumn>
      <TableHeaderColumn dataField="slug" hidden={true}>Slug</TableHeaderColumn>
      <TableHeaderColumn dataField="name" dataAlign="center" dataSort={true}>Name</TableHeaderColumn>
      <TableHeaderColumn dataAlign="center" width="300">Tags (WIP)</TableHeaderColumn>
      <TableHeaderColumn dataField="createdAt" dataAlign="center" dataSort={true} dataFormat={dateFormatter} width="150" filter={filterDate}>Created</TableHeaderColumn>
      <TableHeaderColumn dataField="updatedAt" dataAlign="center" dataSort={true} dataFormat={dateFormatter} width="150" filter={filterDate}>Updated</TableHeaderColumn>
    </BootstrapTable>
  );
};

CampaignReportsTable.propTypes = {
  data: PropTypes.array.isRequired
};

export default CampaignReportsTable;
