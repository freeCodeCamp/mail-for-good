import React from 'react';

import SidebarLink from '../common/SidebarLink';
import SidebarTreeview from '../common/SidebarTreeview';


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

                <SidebarLink to="/">Dashboard</SidebarLink>

                <SidebarTreeview name="Send">
                    <SidebarLink to="/campaign">Campaign WIP</SidebarLink>
                </SidebarTreeview>

                <SidebarTreeview name="Manage">
                    <SidebarLink to="/add-email">Add email</SidebarLink>
                    <SidebarLink to="/import-subscribers">Import subscribers</SidebarLink>
                </SidebarTreeview>

                <SidebarTreeview name="Analytics WIP">
                    <SidebarLink to="/overview">Overview TBA</SidebarLink>
                </SidebarTreeview>

                <SidebarLink to="/activity">Activity TBA</SidebarLink>

                <SidebarLink to="/settings">Settings</SidebarLink>
            </ul>
        </section>
    </aside>
  );
};

export default Sidebar;
