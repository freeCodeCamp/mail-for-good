import React, {Component, PropTypes} from 'react';
import RichTextEditor from 'react-rte';
import style from '../../styles/campaign-text-form.scss';

// Also see ref for Draft JS https://facebook.github.io/draft-js/docs/api-reference-editor.html#content
export default class TextEditor extends Component {
  static propTypes = {
    input: PropTypes.object
  }

  constructor() {
    super();
    this.focus = () => this.refs.editor.focus();
  }

  state = {
    value: {}
  }

  componentWillMount() {
    this.setState({ value: this.props.input.value ? RichTextEditor.createValueFromString(this.props.input.value, 'html') : RichTextEditor.createEmptyValue() });
  }

  onChange(value) {
    this.setState({value});
    this.props.input.onChange(value.toString('html'));
  }

  render() {
    console.log(this.props);
    return (<RichTextEditor
      value={this.state.value}
      onChange={this.onChange.bind(this)}
      placeholder="Write your email"
      spellCheck={true}
      editorClassName="text-editor"
      />);
  }
}
