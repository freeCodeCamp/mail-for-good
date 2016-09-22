import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

class SideLink extends Component {

  render() {
      return (
        <li className={this.context.router.isActive(this.props.to, true) ? 'active' : ''}>
          <Link {...this.props}>
            {this.props.children}
          </Link>
        </li>
      )
  }
};

SideLink.contextTypes = {
    router: PropTypes.func.isRequired
};

export default SideLink;
