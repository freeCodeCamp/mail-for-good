import React, { PropTypes } from 'react';
import ReactTrixEditor from 'react-trix-editor';
import '../../styles/text-editor.scss';
import '../../styles/text-editor-rich.scss';

const TextEditorRich = props => <ReactTrixEditor {...props} />;

TextEditorRich.propTypes = {
  onChange: PropTypes.func.isRequired
};

export default TextEditorRich;
