import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';

import { getLists } from '../actions/listActions';



function mapStateToProps(state) {
    // State reducer @ state.manageList
    return {
        lists: state.manageList.lists,
        isGetting: state.manageList.isGetting
    };
}

@connect(mapStateToProps, { getLists })
export default class ManageList extends Component {

    static propTypes = {

    }

    componentWillReceiveProps(props) {
        console.log(props);
    }

    componentDidMount() {
        // Get lists if we haven't done so before
        if (this.props.lists.length === 0) {
            this.props.getLists();
        }
    }

    render() {
      return (
          <div>
            <div className="content-header">
              <h1>Manage lists <small>Edit, delete and segement your lists here</small></h1>
            </div>

            <section className="content">
                <div className="box">
                    <div className="box-header">
                        <h3 className="box-title">Your lists</h3>
                    </div>

                    <div className="box-body">
                        {/* Need to improve this in due time */}

                        <ol>
                            {this.props.lists.map(list => {
                                return (
                                    <li>{`List: "${list.name}" # Created at ${list.createdAt} # Last updated at ${list.updatedAt}`}</li>
                                );
                            })}
                        </ol>

                        {this.props.isGetting &&
                            <div className="overlay">
                            <FontAwesome name="refresh" spin/>
                            </div>}
                    </div>
                </div>
            </section>
          </div>
      )
    }
}
