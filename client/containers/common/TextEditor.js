import React, { Component, PropTypes } from 'react';
import ReactTrixEditor from 'react-trix-editor';
import '../../styles/campaign-text-form.scss';

export default class TextEditor extends Component {

  static propTypes = {
    input: PropTypes.object,
    onEditor: PropTypes.func
  }

  constructor() {
    super();
    this.onChange = this.onChange.bind(this);
  }

  onChange(value) {
    // Update redux form
    this.props.input.onChange(value);
  }

  render() {
    return (
      <ReactTrixEditor
        onEditor={this.props.onEditor}
        onChange={this.onChange}
        placeholder="Write your email"
        />
    );
  }
}
