import React, { Component, PropTypes } from 'react';
import { Table } from 'react-bootstrap';

export default class SubscribersTable extends Component {

  static propTypes = {
    subscribers: PropTypes.array,
    fields: PropTypes.array,
    deleteSubscriber: React.PropTypes.func
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

  render() {
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
