import React, { PropTypes } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import BSTyle from 'react-bootstrap-table/dist/react-bootstrap-table.min.css';

export default class ManageSubscribersTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: this.props.data
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
    return '<span class="label label-success">Subscribed</span>'
  }


  render() {
    return (
      <BootstrapTable data={this.props.data}
                      pagination={true}
                      hover={true}>
        <TableHeaderColumn dataField="id" hidden={true} isKey={true}>id</TableHeaderColumn>
        <TableHeaderColumn dataField="email">email</TableHeaderColumn>
        <TableHeaderColumn dataField="subscribed" dataFormat={this.formatFieldSubscribed}>status</TableHeaderColumn>
      </BootstrapTable>
    );
  }


}

