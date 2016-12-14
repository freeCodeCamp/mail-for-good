import React, { Component } from 'react';

export default class ErrorsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      errors: this.props.errors || []
    };
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      errors: newProps.errors || []
    });
  }

  render() {
    const numberOfErrors = this.state.errors.length;

    if (numberOfErrors === 0) {
      return <div />;
    }

    return (
      <div>
        <br />
        <div className="callout callout-danger">
          <h4>{numberOfErrors} errors encountered while parsing file</h4>
        </div>
        {this.state.errors.map((error, index) => {
          return (
            <div key={index}>
              <b>Row {error.row}</b> {error.message}
            </div>
          );
        })}
      </div>
    );
  }
}

ErrorsList.propTypes = {
  errors: React.PropTypes.array
};
