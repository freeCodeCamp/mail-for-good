import React, { PropTypes } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import BSTyle from 'react-bootstrap-table/dist/react-bootstrap-table.min.css';
import moment from 'moment';

export default class ManageSubscribersTable extends React.Component {
  static propTypes = {
    data: PropTypes.array.isRequired
  }

  state = {
    data: this.props.data || []
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      data: newProps.data
    });
  }

  formatFieldSubscribed(subscribed) {
    // this is a placeholder for now, since we are not yet handling
    // user subscription state
    console.log(subscribed);
    if (subscribed) {
      return '<span class="label label-success">Subscribed</span>';
    } else {
      return '<span class="label label-danger">Unsubscribed</span>';
    }
  }

  formatDate(cell) {
    return moment(cell).format('lll');
  }

  render() {
    return (
      <BootstrapTable data={this.state.data}
                      pagination={true}
                      hover={true}
                      exportCSV={true}
                      csvFileName="subscribers">

        <TableHeaderColumn dataField="id" hidden={true} isKey={true}>id</TableHeaderColumn>
        <TableHeaderColumn dataField="email">Email</TableHeaderColumn>
        <TableHeaderColumn dataField="mostRecentStatus" dataSort={true} width="150">Status</TableHeaderColumn>
        <TableHeaderColumn dataField="createdAt" dataFormat={this.formatDate} dataSort={true} width="150">Created</TableHeaderColumn>
        <TableHeaderColumn dataField="updatedAt" dataFormat={this.formatDate} dataSort={true} width="150">Updated</TableHeaderColumn>
        <TableHeaderColumn dataField="subscribed"
          dataFormat={this.formatFieldSubscribed}
          width="150"
          dataAlign="center"
          dataSort={true}
          filter={{
            type: 'SelectFilter',
            options: {
              'true': 'Subscribed',
              'false': 'Unsubscribed'
            }
          }}>Status
        </TableHeaderColumn>

      </BootstrapTable>
    );
  }


}
