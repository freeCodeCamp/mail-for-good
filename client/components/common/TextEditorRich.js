import React, { PropTypes } from 'react';
import ReactTrixEditor from 'react-trix-editor';
import '../../styles/text-editor.scss';
const TextEditorRich = props => <div id="rich"><ReactTrixEditor {...props} /></div>;

TextEditorRich.propTypes = {
  onChange: PropTypes.func.isRequired
};

export default TextEditorRich;
