import React, { PropTypes } from 'react';
import ReactTrixEditor from 'react-trix-editor';

const TextEditorPlain = props => <div id="plaintext"><ReactTrixEditor {...props} /></div>;

TextEditorPlain.propTypes = {
  onChange: PropTypes.func.isRequired
};

export default TextEditorPlain;
