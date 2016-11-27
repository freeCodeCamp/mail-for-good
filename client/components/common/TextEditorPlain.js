import React, { PropTypes } from 'react';
import ReactTrixEditor from 'react-trix-editor';
import '../../styles/text-editor.scss';
import '../../styles/text-editor-plaintext.scss';

const TextEditorPlain = props => <div id="plaintext"><ReactTrixEditor {...props} /></div>;

TextEditorPlain.propTypes = {
  onChange: PropTypes.func.isRequired
};

export default TextEditorPlain;
