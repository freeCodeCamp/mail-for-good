/*eslint-disable react/prop-types*/
import React, { Component, PropTypes } from 'react';

class SidebarTreeview extends Component {

  render() {
    return (
      <li className="treeview"> <a href="#">{this.props.name}</a>
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
  name: PropTypes.string.isRequired
};


export default SidebarTreeview;
