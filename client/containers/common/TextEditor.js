import React, {Component, PropTypes} from 'react';

import TextEditorRich from './TextEditorRich';
import TextEditorPlain from './TextEditorPlain';

export default class TextEditor extends Component {

  static propTypes = {
    input: PropTypes.object,
    onEditor: PropTypes.func,
    textEditorType: PropTypes.string
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
    const isPlaintext = this.props.textEditorType === 'Plaintext';
    console.log(this.props.textEditorType);
    return (
      <div>
      {isPlaintext
        ? <TextEditorPlain onEditor={this.props.onEditor} onChange={this.onChange} placeholder="Write your plaintext email"/>
        : <TextEditorRich onEditor={this.props.onEditor} onChange={this.onChange} placeholder="Write your HTML email"/>
      }
      </div>
    );
  }
}
