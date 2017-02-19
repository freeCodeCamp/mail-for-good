import React, { PropTypes } from 'react';
import ReactQuill from 'react-quill';

const TextEditorPlain = props => (
  <ReactQuill
    theme="snow"
    modules={undefined}
    formats={undefined}
    value={props.value}
    onChange={props.onChange}
  />
);

TextEditorPlain.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired
};

export default TextEditorPlain;
