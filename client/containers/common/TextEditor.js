import React, {Component, PropTypes} from 'react';
import 'react-quill/dist/quill.snow.css';

import TextEditorRich from '../../components/common/TextEditorRich';
import TextEditorPlain from '../../components/common/TextEditorPlain';

export default class TextEditor extends Component {

  static propTypes = {
    input: PropTypes.object.isRequired,
    textEditorType: PropTypes.string
  }

  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(value) {
    // Update redux form
    this.props.input.onChange(value);
  }

  render() {
    const {
      input: {
        value
      }
    } = this.props;

    const isPlaintext = this.props.textEditorType === 'Plaintext';

    const textEditorProps = {
      value,
      onChange: this.onChange
    };

    // Render either a plaintext or html editor
    return (
      isPlaintext
        ? <TextEditorPlain {...textEditorProps} />
        : <TextEditorRich {...textEditorProps} />
    );
  }

}
