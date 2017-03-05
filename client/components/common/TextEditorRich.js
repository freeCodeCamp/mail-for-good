import React, { PropTypes } from 'react';
import ReactQuill from 'react-quill';
import Quill from 'quill';

const Block = Quill.import('blots/block');
Block.tagName = 'DIV';

const HTML_MODULE = {
  toolbar: [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],

    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
    [{ 'direction': 'rtl' }],                         // text direction

    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'font': [] }],
    [{ 'align': [] }],

    ['clean']                                         // remove formatting button
  ],
  blots: {
    block: Block
  }
};

const TextEditorRich = props => (
  <ReactQuill
    readOnly={false}
    id="TextEditorRich"
    className="TextEditor"
    bounds="#TextEditorRich"
    placeholder="Write your email ..."
    theme="snow"
    modules={HTML_MODULE}
    formats={undefined}
    value={props.value}
    onChange={props.onChange}
  />
);

TextEditorRich.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func
};

export default TextEditorRich;
