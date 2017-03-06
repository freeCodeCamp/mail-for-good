import React, { Component, PropTypes } from 'react';

export default class TextEditorPlain extends Component {
  static propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func
  }

  render() {
    const { value, onChange } = this.props;
    return (
      <textarea
        className="form-control"
        style={{ width: "100%", minHeight: "60vh" }}
        value={value}
        onChange={onChange}
        />
    );
  }
}
