import React from 'react';
import { Table } from 'react-bootstrap';


export default class SubscribersTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      subscribers: null,
      fields: null
    };
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      subscribers: newProps.subscribers,
      fields: newProps.fields
    });
  }

  render() {  // should add key props to these 3 loops
    return (
      <div>
        {this.state.subscribers &&
        <Table bordered striped>
          <thead>
          <tr>
            {this.state.fields.map((field) => {
              return (
                <th>{field}</th>
              );
            })}
          </tr>
          </thead>
          <tbody>

          {this.state.subscribers.map((subscriber) => {
            return (
              <tr>
                {this.state.fields.map((field) => {
                  return (
                    <td>{subscriber[field]}</td>
                  );
                })}
              </tr>
            );
          })}
          </tbody>
        </Table>}
      </div>
    );
  }
}
