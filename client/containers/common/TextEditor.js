import React, { Component, PropTypes } from 'react';
import ReactTrixEditor from 'react-trix-editor';
import '../../styles/campaign-text-form.scss';

export default class TextEditor extends Component {

  static propTypes = {
    input: PropTypes.object
  }

  constructor() {
    super();
    this.onChange = this.onChange.bind(this);
  }

  componentWillReceiveProps(props) {
    if (props.input.value && props.meta.pristine) { // Has the input prop been updated by the initialize action creator (called when applying templates)?
      // this.setState({ value: RichTextEditor.createValueFromString(props.input.value, 'html') });
    }
  }

  onChange(value) {
    this.props.input.onChange(value);
  }

  render() {
    return (
      <ReactTrixEditor
        onChange={this.onChange}
        placeholder="Write your email"
        />
    );
  }
}
