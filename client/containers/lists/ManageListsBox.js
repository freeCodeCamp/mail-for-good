import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import FontAwesome from 'react-fontawesome';

import { getLists } from '../../actions/listActions';
import ManageListsTable from '../../components/lists/ManageListsTable';

function mapStateToProps(state) {
  // State reducer @ state.manageList
  return {lists: state.manageList.lists, isGetting: state.manageList.isGetting};
}

@connect(mapStateToProps, { getLists })
export default class ManageList extends Component {

  static propTypes = {
    getLists: PropTypes.func.isRequired,
    lists: PropTypes.array.isRequired,
    isGetting: PropTypes.bool.isRequired
  }

  componentDidMount() {
    // Update lists only if we need to
    if (!this.props.lists.length) {
      this.props.getLists();
    }
  }

  render() {
    return (
      <div className="box">
        <div className="box-header">
          <h3 className="box-title">Your lists</h3>
        </div>

        <div className="box-body">
          <ManageListsTable data={this.props.lists}/>

          {this.props.isGetting && <div className="overlay">
            <FontAwesome name="refresh" spin/>
          </div>}
        </div>
      </div>
    );
  }
}
