// Must have at least one test file in this directory or Mocha will throw an error.
import React from 'react';

import SideLink from '../common/SideLink';

const Sidebar = (props) => {
  return (
    <aside className="main-sidebar">
        <section className="sidebar">
            <div className="user-panel">
                <div className="pull-left image"><img className="img-circle" src="https://placeholdit.imgix.net/~text?txtsize=15&txt=160%C3%97160&w=160&h=160" alt="User Image" /></div>
                <div className="pull-left info">
                    <p>Test user</p>
                    <a> Online</a></div>
            </div>

            <ul className="sidebar-menu">
                <li className="header">OPTIONS</li>

                <SideLink to="/">Home</SideLink>
                <SideLink to="/settings">Settings</SideLink>

                <li className="treeview"><a href="#"> Tba </a>
                    <ul className="treeview-menu">
                        <li><a href="#">Link in level 2</a></li>
                        <li><a href="#">Link in level 2</a></li>
                    </ul>
                </li>
            </ul>
        </section>
    </aside>
  )
};

export default Sidebar;
