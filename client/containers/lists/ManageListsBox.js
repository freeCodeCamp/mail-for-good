import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import FontAwesome from 'react-fontawesome';

import { getLists, deleteLists } from '../../actions/listActions';
import ManageListsTable from '../../components/lists/ManageListsTable';

function mapStateToProps(state) {
  // State reducer @ state.manageList
  return {
    lists: state.manageList.lists,
    isGetting: state.manageList.isGetting
  };
}

@connect(mapStateToProps, { getLists, deleteLists })
export default class ManageList extends Component {

  static propTypes = {
    getLists: PropTypes.func.isRequired,
    lists: PropTypes.array.isRequired,
    isGetting: PropTypes.bool.isRequired,
    deleteLists: PropTypes.func.isRequired
  }

  constructor() {
    super();
    this.deleteRows = this.deleteRows.bind(this);
  }

  componentDidMount() {
    // Update lists only if we need to
    if (!this.props.lists.length) {
      this.props.getLists();
    }
  }

  deleteRows(listIds) {
    this.props.deleteLists(listIds, this.props.lists);
  }

  render() {
    return (
      <div className="box box-primary">
        <div className="box-header">
          <h3 className="box-title">Your lists</h3>
        </div>

        <div className="box-body">
          <ManageListsTable data={this.props.lists} deleteRows={this.deleteRows} />

          {this.props.isGetting && <div className="overlay">
            <FontAwesome name="refresh" spin/>
          </div>}
        </div>
      </div>
    );
  }
}
