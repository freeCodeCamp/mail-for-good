/*eslint-disable react/prop-types*/
import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

class SidebarLink extends Component {

  render() {
    return (
      <li className={this.context.router.isActive(this.props.to, true) ? 'active' : ''}>
        <Link {...this.props}>
          {this.props.children}
        </Link>
      </li>
    );
  }
}

SidebarLink.contextTypes = {
  router: PropTypes.object.isRequired
};

SidebarLink.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.string.isRequired
};

export default SidebarLink;
