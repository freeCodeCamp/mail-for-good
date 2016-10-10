import React, { PropTypes } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import BSTyle from 'react-bootstrap-table/dist/react-bootstrap-table.min.css';

export default class ManageListsTable extends React.Component {
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
    });
  }

  render() {
    return (
      <BootstrapTable data={this.state.data}
                      pagination={true}
                      hover={true}>
        <TableHeaderColumn dataField="id" hidden={true} isKey={true}>id</TableHeaderColumn>
        <TableHeaderColumn dataField="name">name</TableHeaderColumn>
        <TableHeaderColumn dataField="createdAt">created at</TableHeaderColumn>
        <TableHeaderColumn dataField="updatedAt">updated at</TableHeaderColumn>
      </BootstrapTable>
    );
  }
}
