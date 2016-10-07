import React, {Component, PropTypes} from 'react';
import RichTextEditor from 'react-rte';

// Also see ref for Draft JS https://facebook.github.io/draft-js/docs/api-reference-editor.html#content
export default class CreateCampaignForm extends Component {
  static PropTypes = {
    input: {
      onChange: PropTypes.func.isRequired
    }
  }

  state = {
    value: RichTextEditor.createEmptyValue()
  }

  onChange(value) {
    this.setState({value});
    this.props.input.onChange(value.toString('markdown')); // Accepts 'html' or 'markdown' - Outputs text to these formats
  }

  render() {
    return <RichTextEditor value={this.state.value} onChange={this.onChange.bind(this)} placeholder="Enter your email body here" spellCheck={true}/>;
  }
}
