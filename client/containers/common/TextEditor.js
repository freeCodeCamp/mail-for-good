// Import the "raw" serializer that ships with Slate.
import React, { Component, PropTypes } from 'react';
<<<<<<< HEAD
import { Editor, Html } from 'slate';

// Create our initial state...

const DEFAULT_NODE = 'paragraph';

const schema = {
  nodes: { /* eslint-disable */
    'block-quote': props => <blockquote {...props.attributes}>{props.children}</blockquote>,
    'bulleted-list': props => <ul {...props.attributes}>{props.children}</ul>,
    'heading-one': props => <h1 {...props.attributes}>{props.children}</h1>,
    'heading-two': props => <h2 {...props.attributes}>{props.children}</h2>,
    'list-item': props => <li {...props.attributes}>{props.children}</li>,
    'numbered-list': props => <ol {...props.attributes}>{props.children}</ol>,
  }, /* eslint-enable */
  marks: {
    bold: {
      fontWeight: 'bold'
    },
    code: {
      fontFamily: 'monospace',
      backgroundColor: '#eee',
      padding: '3px',
      borderRadius: '4px'
    },
    italic: {
      fontStyle: 'italic'
    },
    underlined: {
      textDecoration: 'underline'
    }
  }
};

const BLOCK_TAGS = {
  p: 'paragraph',
  blockquote: 'quote',
  pre: 'code'
};

const MARK_TAGS = {
  em: 'italic',
  strong: 'bold',
  u: 'underline',
};

const rules = [
  {
    deserialize(el, next) {
      const type = BLOCK_TAGS[el.tagName];
      if (!type) return;
      return {
        kind: 'block',
        type: type,
        nodes: next(el.children)
      };
    },
    serialize(object, children) {
      if (object.kind != 'block') return;
      switch (object.type) {
        case 'code': return <pre><code>{children}</code></pre>;
        case 'paragraph': return <p>{children}</p>;
        case 'quote': return <blockquote>{children}</blockquote>;
      }
    }
  },
  // Add a new rule that handles marks...
  {
    deserialize(el, next) {
      const type = MARK_TAGS[el.tagName];
      if (!type) return;
      return {
        kind: 'mark',
        type: type,
        nodes: next(el.children)
      };
    },
    serialize(object, children) {
      if (object.kind != 'mark') return;
      switch (object.type) {
        case 'bold': return <strong>{children}</strong>;
        case 'italic': return <em>{children}</em>;
        case 'underline': return <u>{children}</u>;
      }
    }
  }
];

const html = new Html({ rules });

export default class TextEditor extends Component {

  static propTypes = {
    input: PropTypes.object,
    onEditor: PropTypes.func,
    textEditorType: PropTypes.string,
    // ReduxForm
    onChange: PropTypes.func,
    // Parents
    editorValue: PropTypes.string.isRequired // Html string
  }

  // Set the initial state when the app is first constructed.
  constructor() {
    super();
    this.onChange = this.onChange.bind(this);
  }

  state = {
    state: html.deserialize('')
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
    if (nextProps.editorValue) {
      this.setState({
        state: html.deserialize('<p>Hi</p>')
      });
    }
  }

  onKeyDown = (e, data, state) => {
    if (!data.isMod) return;
    let mark;

    switch (data.key) {
      case 'b':
        mark = 'bold';
        break;
      case 'i':
        mark = 'italic';
        break;
      case 'u':
        mark = 'underlined';
        break;
      case '`':
        mark = 'code';
        break;
      default:
        return;
    }

    state = state
      .transform()
      .toggleMark(mark)
      .apply();

    e.preventDefault();
    return state;
  }

  hasMark = (type) => {
    const { state } = this.state;
    return state.marks.some(mark => mark.type == type);
  }

  hasBlock = (type) => {
    const { state } = this.state;
    return state.blocks.some(node => node.type == type);
  }

  onClickMark = (e, type) => {
    e.preventDefault();
    let { state } = this.state;

    state = state
      .transform()
      .toggleMark(type)
      .apply();

    this.setState({ state });
  }

  onClickBlock = (e, type) => {
    e.preventDefault();
    let { state } = this.state;
    let transform = state.transform();
    const { document } = state;

    // Handle everything but list buttons.
    if (type != 'bulleted-list' && type != 'numbered-list') {
      const isActive = this.hasBlock(type);
      const isList = this.hasBlock('list-item');

      if (isList) {
        transform
          .setBlock(isActive ? DEFAULT_NODE : type)
          .unwrapBlock('bulleted-list')
          .unwrapBlock('numbered-list');
      }

      else {
        transform
          .setBlock(isActive ? DEFAULT_NODE : type);
      }
    }

    // Handle the extra wrapping required for list buttons.
    else {
      const isList = this.hasBlock('list-item');
      const isType = state.blocks.some((block) => {
        return !!document.getClosest(block.key, parent => parent.type == type);
      });

      if (isList && isType) {
        transform
          .setBlock(DEFAULT_NODE)
          .unwrapBlock('bulleted-list')
          .unwrapBlock('numbered-list');
      } else if (isList) {
        transform
          .unwrapBlock(type == 'bulleted-list' ? 'numbered-list' : 'bulleted-list')
          .wrapBlock(type);
      } else {
        transform
          .setBlock('list-item')
          .wrapBlock(type);
      }
    }

    state = transform.apply();
    this.setState({ state });
  }

  // On change, update the app's React state with the new editor state.
  onChange(state) {
    // ReduxForm on change
    const { input: { onChange } } = this.props;
    this.setState({ state });

    const plainHtml = html.serialize(state);
    onChange(plainHtml);
  }

  render() {
    const isPlaintext = this.props.textEditorType === 'Plaintext';

    const renderMarkButton = (type, icon) => {
      const isActive = this.hasMark(type);
      const onMouseDown = e => this.onClickMark(e, type);

      return (
        <span className="button" onMouseDown={onMouseDown} data-active={isActive}>
          <i className={`fa ${icon}`} aria-hidden="true" />
        </span>
      );
    };

    const renderBlockButton = (type, icon) => {
      const isActive = this.hasBlock(type);
      const onMouseDown = e => this.onClickBlock(e, type);

      return (
        <span className="button" onMouseDown={onMouseDown} data-active={isActive}>
          <i className={`fa ${icon}`} aria-hidden="true" />
        </span>
      );

      /*return (
        <span className="button" onMouseDown={onMouseDown} data-active={isActive}>
          <i className="material-icons">{icon}</i>
        </span>
      );*/
    };

    const renderEditor = () => {
      return (
        <div className="editor">
          <Editor
            spellCheck
            placeholder={'Enter some rich text...'}
            schema={schema}
            state={this.state.state}
            onChange={this.onChange}
            onKeyDown={this.onKeyDown}
          />
        </div>
      );
    };

    const renderToolbar = () => {
      return (
        <div className="menu toolbar-menu">
          {renderMarkButton('bold', 'fa-bold')}
          {renderMarkButton('italic', 'fa-italic')}
          {renderMarkButton('underlined', 'fa-underline')}
          {renderMarkButton('code', 'fa-code')}
          {renderBlockButton('heading-one', 'fa-header')}
          {renderBlockButton('block-quote', 'fa-quote-right')}
          {renderBlockButton('numbered-list', 'fa-list-ol')}
          {renderBlockButton('bulleted-list', 'fa-list-ul')}
        </div>
      );
    };

    return (
      <div>
        {renderToolbar()}
        {renderEditor()}
      </div>
    );
  }

}

/*import React, {Component, PropTypes} from 'react';
=======
import ReactQuill from 'react-quill';
>>>>>>> 774e31b... Revert changes to the editor


export default class TextEditor extends Component {

  static propTypes = {
    input: PropTypes.object,
    onEditor: PropTypes.func,
    textEditorType: PropTypes.string,
    // ReduxForm
    onChange: PropTypes.func,
    // Parents
    editorValue: PropTypes.string.isRequired // Html string
  }

  // Set the initial state when the app is first constructed.
  constructor() {
    super();
    this.onDocumentChange = this.onDocumentChange.bind(this);
  }

  state = {
    text: ''
  }

  render() {
    const isPlaintext = this.props.textEditorType === 'Plaintext';

    const onTextChange = function(value) {
      this.setState({ text:value });
    };

    return (
      <ReactQuill value={this.state.text}
                  onChange={this.onTextChange} />
    );
  }

}
*/
