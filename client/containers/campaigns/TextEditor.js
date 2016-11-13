import React, { Component, PropTypes } from 'react';
import RichTextEditor from 'react-rte';
import '../../styles/campaign-text-form.scss';

export default class TextEditor extends Component {

  static propTypes = {
    input: PropTypes.object
  }

  constructor() {
    super();
  }

  state = {
    value: {}
  }

  componentWillMount() { // Does a value already exist for this text editor (user has already input data)?
    this.setState({ value: this.props.input.value ? RichTextEditor.createValueFromString(this.props.input.value, 'html') : RichTextEditor.createEmptyValue() });
  }

  componentWillReceiveProps(props) {
    if (props.input.value && props.meta.pristine) { // Has the input prop been updated by the initialize action creator (called when applying templates)?
      this.setState({ value: RichTextEditor.createValueFromString(props.input.value, 'html') });
    }
  }

  onChange(value) {
    this.setState({ value });
    this.props.input.onChange(value.toString('html'));
  }

  render() {
    return (
      <RichTextEditor
      value={this.state.value}
      onChange={this.onChange.bind(this)}
      placeholder="Write your email"
      spellCheck={true}
      editorClassName="text-editor"
      />
    );
  }
}
