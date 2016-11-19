import React, { Component, PropTypes } from 'react';
import { Table } from 'react-bootstrap';

export default class SubscribersTable extends Component {

  propTypes = {
    subscribers: PropTypes.array,
    fields: PropTypes.array
  }

  constructor(props) {
    super(props);

    this.state = {
      subscribers: null || this.props.subscribers,
      fields: null || this.props.fields
    };
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      subscribers: newProps.subscribers,
      fields: newProps.fields
    });
  }

  render() {  // should add key props to these 3 loops
    // const metaFields = ['delete'];

    return (
      <div>
        {this.state.subscribers &&
        <Table bordered striped>
          <thead>
          <tr>
            {this.state.fields.map((field, index) => {
              return (
                <th key={index}>{field}</th>
              );
            })}
          </tr>
          </thead>
          <tbody>

          {this.state.subscribers.map((subscriber, rowIndex) => {
            return (
              <tr key={rowIndex}>
                {this.state.fields.map((field, colIndex) => {
                  return (
                    <td key={colIndex}>{subscriber[field]}</td>
                  );
                })}

                {/* Meta fields (e.g. unsubscribe, delete, ...) that are always present on each row */}
                {/*                 <td>
                                  <Button onClick={this.props.deleteSubscriber.bind(this, rowIndex)}>
                                    <FontAwesome name="trash"/>
                                  </Button>
                                </td> */}
              </tr>
            );
          })}
          </tbody>
        </Table>}
      </div>
    );
  }
}

SubscribersTable.propTypes = {
  deleteSubscriber: React.PropTypes.func,
};
