import React, { PropTypes, Component } from 'react';
import { BootstrapTable, TableHeaderColumn, ExportCSVButton } from 'react-bootstrap-table';
import moment from 'moment';

export default class ManageSubscribersTable extends Component {

  static propTypes = {
    data: PropTypes.array.isRequired,
    deleteRows: PropTypes.func.isRequired,
    onPageChange: PropTypes.func.isRequired,
    additionalFields: PropTypes.array.isRequired,
    listId: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired
  }

  constructor(props) {
    super(props);

    this.filters = {};
    this.state = {
      data: this.props.data || [],
      additionalFields: this.props.additionalFields || [],
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
      data: newProps.data,
      additionalFields: newProps.additionalFields || []
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

  formatAdditionalData(cell, row, extra) {
    return eval(`row.${extra}`);
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
    this.filters = filters;

    this.props.onPageChange(this.state.page, this.state.sizePerPage, filters);
  }

  onExportToCSV() {
    let downloadUrl = `${window.location.origin}/api/list/subscribers/csv?listId=${this.props.listId}&filters=${JSON.stringify(this.filters)}`;
    window.location = encodeURI(downloadUrl);
  }

  customExportCSVButton() {
    return (
      <ExportCSVButton
      btnText='Export all to CSV'
      onClick={this.onExportToCSV.bind(this)}
      >
      </ExportCSVButton>
    )
  }

  render() {
    // create an array of columns and map over them
    // - need to generate columns at the same time rather than using an inline {this.state.additionalFields.map(...)}
    // see https://github.com/AllenFang/react-bootstrap-table/issues/410

    let additionalColumns = this.state.additionalFields.map(field => {
      // dynamically generate additional columns for custom data (stored in data[additionalData][{dataField}].
      // we use formatExtraData to access the nested values - see https://github.com/AllenFang/react-bootstrap-table/issues/50
      return <TableHeaderColumn dataField={'additionalData.'+field} key={'additionalData.'+field} dataFormat={this.formatAdditionalData} formatExtraData={'additionalData.'+field}>{field}</TableHeaderColumn>;
    });

    let columns = [
      <TableHeaderColumn dataField="id" key="id" hidden={true}>id</TableHeaderColumn>,
      <TableHeaderColumn dataField="email" key="email">Email</TableHeaderColumn>
    ].concat(additionalColumns).concat([
      <TableHeaderColumn dataField="createdAt" key="createdAt" dataFormat={this.formatDate} width="150">Created</TableHeaderColumn>,
      <TableHeaderColumn dataField="updatedAt" key="updatedAt" dataFormat={this.formatDate} width="150">Updated</TableHeaderColumn>,
      <TableHeaderColumn
        dataField="mostRecentStatus"
        key="mostRecentStatus"
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
        }}>Feedback</TableHeaderColumn>,
      <TableHeaderColumn dataField="subscribed"
                         key="subscribed"
                         dataFormat={this.formatFieldSubscribed}
                         width="150"
                         dataAlign="center"
                         filter={{
                           type: 'SelectFilter',
                           options: {
                             'true': 'Subscribed',
                             'false': 'Unsubscribed'
                           }
                         }}>Status</TableHeaderColumn>
    ]);

    return (
      <BootstrapTable data={this.state.data}
      remote={true}
      fetchInfo={{ dataTotalSize: this.props.total }}
      options={{
        clearSearch: true,
        noDataText: 'This list has no subscribers',
        exportCSVBtn: this.customExportCSVButton.bind(this),
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
      csvFileName="subscribers"
      keyField="id"
      >
        {
          columns.map(c => { return c; })
        }
      </BootstrapTable>
    );
  }
}
