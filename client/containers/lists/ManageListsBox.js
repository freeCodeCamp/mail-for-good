import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import FontAwesome from 'react-fontawesome';

import { getLists, deleteLists, editListName } from '../../actions/listActions';
import ManageListsTable from '../../components/lists/ManageListsTable';
import ListSignupFormCreator from '../../components/lists/ListSignupFormCreator';

function mapStateToProps(state) {
  // State reducer @ state.manageList
  return {
    lists: state.manageList.lists,
    isGetting: state.manageList.isGetting
  };
}

const mapDispatchToProps = { getLists, deleteLists, editListName };

export class ManageListsBoxComponent extends Component {

  static propTypes = {
    getLists: PropTypes.func.isRequired,
    lists: PropTypes.array.isRequired,
    isGetting: PropTypes.bool.isRequired,
    deleteLists: PropTypes.func.isRequired,
    editListName: PropTypes.func.isRequired
  }

  constructor() {
    super();
    this.deleteRows = this.deleteRows.bind(this);
    this.editListName = this.editListName.bind(this);
    this.state = {
      showListSignupFormCreator: false,
      subscribeKey: ''
    };
  }

  componentDidMount() {
    // Update lists only if we need to
    this.props.getLists();
  }

  deleteRows(listIds) {
    this.props.deleteLists(listIds, this.props.lists);
  }

  editListName(listId, newName){
    this.props.editListName(listId, newName, this.props.lists);
  }

  showListSignupFormCreator(subscribeKey) {
    this.setState({
      subscribeKey,
      showListSignupFormCreator: true
    });
  }


  render() {
    return (
      <div className="box box-primary">
        <ListSignupFormCreator subscribeKey={this.state.subscribeKey}
                               showModal={this.state.showListSignupFormCreator}
        />
        <div className="box-header">
          <h3 className="box-title">Your lists</h3>
        </div>

        <div className="box-body">
          <ManageListsTable data={this.props.lists}
            deleteRows={this.deleteRows}
            showListSignupFormCreator={this.showListSignupFormCreator.bind(this)}
            editListName={this.editListName}
          />

          {this.props.isGetting && <div className="overlay">
            <FontAwesome name="refresh" spin/>
          </div>}
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageListsBoxComponent);
