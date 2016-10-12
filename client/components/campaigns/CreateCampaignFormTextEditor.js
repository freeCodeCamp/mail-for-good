import React, {Component, PropTypes} from 'react';
import RichTextEditor from 'react-rte';
import style from '../../styles/campaign-text-form.scss';

// Also see ref for Draft JS https://facebook.github.io/draft-js/docs/api-reference-editor.html#content
export default class CreateCampaignForm extends Component {
  static propTypes = {
    input: PropTypes.object
  }

  state = {
    value: RichTextEditor.createEmptyValue()
  }

  onChange(value) {
    this.setState({value});
    this.props.input.onChange(value.toString('html'));
  }

  render() {
    return <RichTextEditor
      value={this.state.value}
      onChange={this.onChange.bind(this)}
      placeholder="Write your email"
      spellCheck={true}
      editorClassName="text-editor"
      />;
  }
}
