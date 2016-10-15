import React, { PropTypes } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import BSTyle from 'react-bootstrap-table/dist/react-bootstrap-table.min.css';
import moment from 'moment';


export default class ManageSubscribersTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: this.props.data || []
    };
  }

  static propTypes = {
    data: PropTypes.array.isRequired
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      data: newProps.data
    })
  }

  formatFieldSubscribed(subscribed) {
    // this is a placeholder for now, since we are not yet handling
    // user subscription state
    if (subscribed) {
      return '<span class="label label-success">Subscribed</span>'
    } else {
      return '<span class="label label-danger">Unsubscribed</span>'
    }
  }

  formatDate(cell) {
    return moment(cell).format('lll');
  };


  render() {
    return (
      <BootstrapTable data={this.state.data}
                      pagination={true}
                      hover={true}>
        <TableHeaderColumn dataField="id" hidden={true} isKey={true}>id</TableHeaderColumn>
        <TableHeaderColumn dataField="email">Email</TableHeaderColumn>
        <TableHeaderColumn dataField="createdAt" dataFormat={this.formatDate} dataSort={true} width="150">Created</TableHeaderColumn>
        <TableHeaderColumn dataField="updatedAt" dataFormat={this.formatDate} dataSort={true} width="150">Updated</TableHeaderColumn>
        <TableHeaderColumn dataField="subscribed" dataFormat={this.formatFieldSubscribed} width="150" dataAlign="center" dataSort={true}>Status</TableHeaderColumn>
      </BootstrapTable>
    );
  }


}

