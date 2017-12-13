/*eslint-disable react/prop-types*/
import React, { Component, PropTypes } from 'react';

class DisabledLink extends Component {

  render() {
    return (
      <li>
        <a href="#">
          <i className={`fa ${this.props.icon || 'fa-circle-o'}`} style={{ color: '#666666' }} /><span style={{ color: '#666666' }}>{this.props.children}</span>
        </a>
      </li>
    );
  }
}

DisabledLink.contextTypes = {
  router: PropTypes.object.isRequired
};

DisabledLink.propTypes = {
  icon: PropTypes.string,
  children: PropTypes.string.isRequired
};

export default DisabledLink;
