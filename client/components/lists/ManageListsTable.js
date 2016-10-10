import React, { PropTypes } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import BSTyle from 'react-bootstrap-table/dist/react-bootstrap-table.min.css';
import moment from 'moment';

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
      </BootstrapTable>
    );
  }
}
