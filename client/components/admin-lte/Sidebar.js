import React from 'react';

import SideLink from '../common/SideLink';


const Sidebar = (props) => {  // eslint-disable-line no-unused-vars
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

                <SideLink to="/">Dashboard</SideLink>

                <li className="treeview"><a href="#">Send</a>
                    <ul className="treeview-menu">
                        <SideLink to="/TBA">Campaign TBA</SideLink>
                    </ul>
                </li>

                <li className="treeview"><a href="#">Manage</a>
                    <ul className="treeview-menu">
                        <SideLink to="/add-email">Add email</SideLink>
                        <SideLink to="/import-subscribers">Import subscribers</SideLink>
                    </ul>
                </li>

                <li className="treeview"><a href="#">Analytics TBA</a>
                    <ul className="treeview-menu">
                        <SideLink to="/TBA">Overview TBA</SideLink>
                    </ul>
                </li>

                <SideLink to="/activity">Activity TBA</SideLink>

                <SideLink to="/settings">Settings</SideLink>
            </ul>
        </section>
    </aside>
  );
};

export default Sidebar;
