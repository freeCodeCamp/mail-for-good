// Import the "raw" serializer that ships with Slate.
import React, { Component, PropTypes } from 'react';
import { Editor, Raw } from 'slate';

// Create our initial state...
const initialState = Raw.deserialize({
  nodes: [
    {
      kind: 'block',
      type: 'paragraph',
      nodes: [
        {
          kind: 'text',
          text: 'A line of text in a paragraph.'
        }
      ]
    }
  ]
}, { terse: true });

export default class TextEditor extends Component {

  static propTypes = {
    input: PropTypes.object,
    onEditor: PropTypes.func,
    textEditorType: PropTypes.string
  }

  // Set the initial state when the app is first constructed.
  constructor() {
    super();
    this.onChange = this.onChange.bind(this);
  }

  state = {
    state: {}
  }

  // On change, update the app's React state with the new editor state.
  onChange(state) {
    this.setState({ state });
  }

  render() {
    const isPlaintext = this.props.textEditorType === 'Plaintext';

    return (
      <Editor
        style={{
          border: "1px solid black",
          minHeight: "60vh"
        }}
        state={this.state.state}
        onChange={this.onChange}
      />
    );
  }

}

/*import React, {Component, PropTypes} from 'react';

import TextEditorRich from '../../components/common/TextEditorRich';
import TextEditorPlain from '../../components/common/TextEditorPlain';

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
*/
