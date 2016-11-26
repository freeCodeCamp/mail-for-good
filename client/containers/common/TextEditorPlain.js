import React, { PropTypes } from 'react';
import ReactTrixEditor from 'react-trix-editor';
import '../../styles/text-editor.scss';
import '../../styles/text-editor-plaintext.scss';

const TextEditorPlain = props => <ReactTrixEditor {...props} />;

TextEditorPlain.propTypes = {
  onChange: PropTypes.func.isRequired
};

export default TextEditorPlain;
