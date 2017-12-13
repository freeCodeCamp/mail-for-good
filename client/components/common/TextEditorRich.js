import React, { Component, PropTypes } from 'react';
import ReactQuill from 'react-quill';
import Quill from 'quill';

// Change <p> tags to <div> tags as empty lines are rendered as <p><br></p> which is two spaces, <div><br></div> is one
// Adapted from https://codepen.io/alexkrolick/pen/PWrKdx?editors=0010 and https://codepen.io/quill/pen/VjgorV
const Block = Quill.import('blots/block');
Block.tagName = 'DIV';
Quill.register(Block, true);

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
  ]
};

export default class TextEditorRich extends Component {
  static propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func
  }

  render() {
    const { value, onChange } = this.props;
    return (
      <ReactQuill
        readOnly={false}
        id="TextEditorRich"
        bounds="#TextEditorRich"
        placeholder="Write your email ..."
        theme="snow"
        modules={HTML_MODULE}
        formats={undefined}
        value={value}
        onChange={onChange}
      />
    );
  }
}
