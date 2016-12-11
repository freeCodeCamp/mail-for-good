/*eslint-disable react/prop-types*/
import React, { Component, PropTypes } from 'react';

class SidebarTreeview extends Component {

  render() {
    return (
      <li className="treeview">
        <a href="#">
          <i className={`fa ${this.props.icon}`}/><span>{this.props.name}</span>
        </a>
        <ul className="treeview-menu">
          {this.props.children}
        </ul>
      </li>
    );
  }
}

SidebarTreeview.contextTypes = {
  router: PropTypes.object.isRequired
};

SidebarTreeview.propTypes = {
  name: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired
};

export default SidebarTreeview;
