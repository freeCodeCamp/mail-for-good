import React, { PropTypes } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Link } from 'react-router';
import moment from 'moment';
import BSTyle from 'react-bootstrap-table/dist/react-bootstrap-table.min.css';

export default class ManageListsTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: this.props.data || []
    };

    this.options = {
      noDataText: 'You do not have any lists linked with your account'
    };
  }

  static propTypes = {
    data: PropTypes.array.isRequired
  }

  formatFieldDate(cell) {
    return moment(cell).format('lll');
  }

  formatFieldManageSubscribers(cell, row) {
    return (
      <Link to={`/lists/manage/${row.id}`}>
      <button type="button" className="btn btn-default btn-flat">
          <i className="fa fa-user" />
      </button>
      </Link>
    )
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      data: newProps.data
    });
  }

  render() {
    return (
      <BootstrapTable data={this.state.data}
                      pagination={true}
                      options={this.options}
                      hover={true}>

        <TableHeaderColumn dataField="id" hidden={true} isKey={true}>id</TableHeaderColumn>
        <TableHeaderColumn dataField="name" dataSort={true}>Name</TableHeaderColumn>
        <TableHeaderColumn dataField="createdAt" dataSort={true} dataFormat={this.formatFieldDate}>Created</TableHeaderColumn>
        <TableHeaderColumn dataField="updatedAt" dataSort={true} dataFormat={this.formatFieldDate}>Updated</TableHeaderColumn>
        <TableHeaderColumn dataAlign="center" width="150" dataFormat={this.formatFieldManageSubscribers}>Subscribers</TableHeaderColumn>
      </BootstrapTable>
    );
  }
}
