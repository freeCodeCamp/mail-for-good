import React, { Component, PropTypes } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import moment from 'moment';

export default class ManageReceivedPermissionOffersTable extends Component {

  static propTypes = {
    data: PropTypes.array.isRequired,
    rejectRows: PropTypes.func.isRequired,
    acceptRows: PropTypes.func.isRequired
  }

  render() {

      const { data, rejectRows, acceptRows } = this.props;

      const selectRowProp = {
        mode: "checkbox",
        clickToSelect: true,
        bgColor: "rgb(176, 224, 230)",
        onSelect: onSelect,
        onSelectAll: onSelectAll
      };

      let rows = [];
      let didAccept = false;

      function onSelect(row, isSelected) {
        if (row) {
          if (isSelected && !rows.find(x => x.id === row.id)) {
            rows = [...rows, row];
          } else {
            rows = rows.filter(x => x.id !== row.id);
          }
        }
      }

      function onSelectAll(isSelected, selectedRows) {
        if (selectedRows) {
          if (isSelected) {
            rows = selectedRows;
          } else {
            rows = [];
          }
        }
      }

      const acceptBid = () => {
        didAccept = true;
        const rowIds = rows.map(x => x.id);
        acceptRows(rowIds);
        this.refs.mrpo.handleDropRow(rowIds);
      };

      /* eslint-disable */
      const createCustomInsertButton = () => {
        return (
          <InsertButton
            btnContextual='btn-success'
            onClick={ () => acceptBid() }>
                <i className="fa fa-check" aria-hidden="true" /> Accept
          </InsertButton>
        );
      }

      const createCustomDeleteButton = onClick => {
        return (
          <DeleteButton
            btnContextual='btn-danger'
            onClick={ onClick }>
                <i className="fa fa-times" aria-hidden="true" /> Reject
          </DeleteButton>
        );
      }
      /* eslint-enable */

      const options = {
        noDataText: 'You have not received any permission offers',
        insertBtn: createCustomInsertButton,
        deleteBtn: createCustomDeleteButton,
        afterDeleteRow: rows => { // Optimistic update, can assume request will succeed. 'Rows' has format [...rowKey] where rowKey is a list primary key
          if (didAccept) {
            didAccept = false;
          } else {
            rejectRows(rows);
          }
        },
        handleConfirmDeleteRow: next => { next(); } // By default, react-bootstrap-table confirms choice using an alert. We want to override that behaviour.
      };

      const formatFieldDate = cell => moment(cell).format('lll');

      /*
      Each data item has form:

      {
        id: '1',
        toUserEmail: 'email@gmail.com',
        campaigns: 'Read',
        createdAt: '2016-12-11T02:27:30.152Z',
        updatedAt: '2016-12-11T02:27:30.152Z'
      }

      */

    return (
      <BootstrapTable data={data}
        pagination={true}
        hover={true}
        insertRow={true}
        deleteRow={true}
        selectRow={selectRowProp}
        options={options}
        ref="mrpo">

        <TableHeaderColumn dataField="id" hidden={true} isKey={true}>id</TableHeaderColumn>
        <TableHeaderColumn dataField="fromUserEmail" dataSort={true}>Email</TableHeaderColumn>

        <TableHeaderColumn dataField="campaigns" dataSort={true}>Campaign Access</TableHeaderColumn>
        <TableHeaderColumn dataField="templates" dataSort={true}>Templates Access</TableHeaderColumn>
        <TableHeaderColumn dataField="lists" dataSort={true}>Lists Access</TableHeaderColumn>

        <TableHeaderColumn dataField="createdAt" dataSort={true} width="150" dataFormat={formatFieldDate}>Created</TableHeaderColumn>
        <TableHeaderColumn dataField="updatedAt" dataSort={true} width="150" dataFormat={formatFieldDate}>Updated</TableHeaderColumn>
      </BootstrapTable>
    );
  }
}
