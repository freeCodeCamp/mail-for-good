import React, { PropTypes } from 'react';
import ReactQuill from 'react-quill';

// See Quill's module system ref = http://quilljs.com/docs/modules/
// Sets what appears in the toolbar
// NOTE: Getting links to automatically show up is a bit tricky, it has been addressed here https://github.com/quilljs/quill/issues/109
const PLAINTEXT_MODULE = {
  toolbar: [
    [{ 'list': 'ordered'}]
  ]
};

// Althought an item may not appear in the toolbar, it will still be possible for users to
// paste bold text or use shortcodes ctrl-b unless valid formats are explicitly specified.
// The formats constant ensures that only the items listed below are valid in the text editor.
const PLAINTEXT_FORMATS = [
  'list'
];

const TextEditorPlain = props => (
  <ReactQuill
    theme="snow"
    id="TextEditorPlain"
    className="TextEditor"
    bounds="#TextEditorPlain"
    readOnly={false}
    placeholder="Write your email ..."
    modules={PLAINTEXT_MODULE}
    formats={PLAINTEXT_FORMATS}
    value={props.value}
    onChange={props.onChange}
  />
);

TextEditorPlain.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func
};

export default TextEditorPlain;
