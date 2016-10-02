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

                <SidebarTreeview name="Campaigns">
                    <SidebarLink to="/campaigns/create">Create Campaign WIP</SidebarLink>  {/* typeofcampaign (html, plain etc), use template, steps= 1. to who - 2. campaign info (name, from, subject, from email, options for tracking) 3. Template 4. Write the actual email 5. send & confirm*/}
                    <SidebarLink to="/campaigns/manage">Manage Campaigns WIP</SidebarLink> {/* delete, resend, edit, view report (analytics) */}
                    <SidebarLink to="/campaigns/templates">Templates WIP</SidebarLink> {/* CRUD templates */}
                </SidebarTreeview>

                <SidebarTreeview name="Lists">
                    <SidebarLink to="/lists/create">Create List</SidebarLink> {/* Import from CSV etc. Keep this isolated to importing */}
                    <SidebarLink to="/lists/manage">Manage Lists</SidebarLink> {/* RUD, Export list, statistics, add subscriber, duplicate list, combine list */}
                </SidebarTreeview>

                <SidebarTreeview name="Analytics WIP">
                    <SidebarLink to="/analytics/overview">Overview TBA</SidebarLink>  {/* General overview of all campaigns */}
                    <SidebarLink to="/analytics/reports">Campaign Reports TBA</SidebarLink> {/* Bounce rate, click rate, open rate, unsub no., etc */}
                </SidebarTreeview>

                <SidebarLink to="/settings">Settings</SidebarLink>
            </ul>
        </section>
    </aside>
  );
};

export default Sidebar;
