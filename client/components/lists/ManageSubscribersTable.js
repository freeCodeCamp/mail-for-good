import React, { PropTypes, Component } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table.min.css';
import moment from 'moment';

export default class ManageSubscribersTable extends Component {

  static propTypes = {
    data: PropTypes.array.isRequired,
    deleteRows: PropTypes.func.isRequired,
    onPageChange: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);

    this.state = {
      data: this.props.data || [],
      currentPage: 1,
      sizePerPage: 10
    };

    this.selectRowProp = {
      mode: "checkbox",
      bgColor: "rgb(176, 224, 230)"
    };
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      data: newProps.data
    });
  }

  formatFieldSubscribed(subscribed) {
    // this is a placeholder for now, since we are not yet handling
    // user subscription state
    if (subscribed) {
      return '<span class="label label-success">Subscribed</span>';
    } else {
      return '<span class="label label-danger">Unsubscribed</span>';
    }
  }

  formatDate(cell) {
    return moment(cell).format('lll');
  }

  formatStatus(status) {
    if (status === 'bounce:transient') {
      return `<span class="label label-warning">Bounce: transient</span>`;
    } else if (status === 'bounce:permanent') {
      return `<span class="label label-danger">Bounce: permanent</span>`;
    } else if (status === 'bounce:undetermined') {
      return `<span class="label label-warning">Bounce: undetermined</span>`;
    } else if (status === 'complaint') {
      return `<span class="label label-danger">Complaint</span>`;
    } else if (status === 'unconfirmed') {
      return `<span class="label label-default">Unconfirmed</span>`;
    }
  }

  onPageChange(page, sizePerPage) {
    this.props.onPageChange(page, sizePerPage);

    this.setState({
      currentPage: page
    });
  }

  onSizePerPageList(sizePerPage) {
    this.props.onPageChange(this.state.page, sizePerPage);

    this.setState({
      sizePerPage
    });
  }

  onFilterChange(rawFilters) {
    let filters = {};
    if (Object.keys(rawFilters).includes('subscribed')) {
      filters.subscribed = rawFilters.subscribed.value;
    }

    if (Object.keys(rawFilters).includes('mostRecentStatus')) {
      filters.mostRecentStatus = rawFilters.mostRecentStatus.value;
    }

    this.props.onPageChange(this.state.page, this.state.sizePerPage, filters)
  }

  onExportToCSV() {
    window.location = `${window.location.origin}/api/list/subscribers/csv?listId=${this.props.listId}`;
  }

  render() {
    return (
      <BootstrapTable data={this.state.data}
                      remote={true}
                      fetchInfo={ { dataTotalSize: this.props.total } }
                      options={{
                        clearSearch: true,
                        noDataText: 'This list has no subscribers',
                        onExportToCSV: this.onExportToCSV.bind(this),
                        onFilterChange: this.onFilterChange.bind(this),
                        onPageChange: this.onPageChange.bind(this),
                        onSizePerPageList: this.onSizePerPageList.bind(this),
                        sizePerPage: this.state.sizePerPage,
                        sizePerPageList: [ 10, 25, 50, 100 ],
                        page: this.state.currentPage,
                        onRowClick: () => {
                        },
                        afterDeleteRow: rows => { // Optimistic update, can assume request will succeed. 'Rows' has format [...rowKey] where rowKey is a list primary key
                          this.props.deleteRows(rows);
                        },
                        handleConfirmDeleteRow: next => { next(); } // By default, react-bootstrap-table confirms choice using an alert. We want to override that behaviour.
                      }}
                      deleteRow={true}
                      selectRow={this.selectRowProp}
                      pagination={true}
                      hover={true}
                      maintainSelected={true}
                      exportCSV={true}
                      csvFileName="subscribers">

        <TableHeaderColumn dataField="id" hidden={true} isKey={true}>id</TableHeaderColumn>
        <TableHeaderColumn dataField="email">Email</TableHeaderColumn>
        <TableHeaderColumn dataField="createdAt" dataFormat={this.formatDate} width="150">Created</TableHeaderColumn>
        <TableHeaderColumn dataField="updatedAt" dataFormat={this.formatDate} width="150">Updated</TableHeaderColumn>
        <TableHeaderColumn
          dataField="mostRecentStatus"
          dataFormat={this.formatStatus}
          dataAlign="center"
          width="150"
          filter={{
            type: 'SelectFilter',
            options: {
              'bounce:permanent': 'Bounce: permanent',
              'bounce:transient': 'Bounce: transient',
              'bounce:undetermined': 'Bounce: undetermined',
              'complaint': 'Complaint',
              'unconfirmed': 'Unconfirmed'
            }
          }}>Feedback
        </TableHeaderColumn>
        <TableHeaderColumn dataField="subscribed"
          dataFormat={this.formatFieldSubscribed}
          width="150"
          dataAlign="center"
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
