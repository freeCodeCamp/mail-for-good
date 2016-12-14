import React, { PropTypes } from 'react';

import SidebarLink from '../common/SidebarLink';
import SidebarTreeview from '../common/SidebarTreeview';

const Sidebar = (props) => { // eslint-disable-line no-unused-vars
  const { user, activeAccount } = props;

  return (
    <aside className="main-sidebar">
      <section className="sidebar">
        <div className="user-panel">
          <div className="pull-left image"><img className="img-circle" src={user.picture || 'https://placeholdit.imgix.net/~text?txtsize=15&txt=160%C3%97160&w=160&h=160'} alt="User Image" /></div>
          <div className="pull-left info">
            <p>{user.name || 'Loading...'}</p>
            <a><i className="fa fa-circle text-success" />Online</a>
          </div>
        </div>

        <ul className="sidebar-menu">
          <li className="header">OPTIONS</li>

          <SidebarLink to="/" icon="fa-tachometer">Dashboard</SidebarLink>

          <SidebarTreeview name="Campaigns" icon="fa-envelope">
            <SidebarLink to="/campaigns/create">Create Campaign</SidebarLink> {/* typeofcampaign (html, plain etc), use template, steps= 1. to who - 2. campaign info (name, from, subject, from email, options for tracking) 3. Template 4. Write the actual email 5. send & confirm*/}
            <SidebarLink to="/campaigns/manage">Manage Campaigns</SidebarLink> {/* delete, resend, edit, view report (analytics) */}
          </SidebarTreeview>

          <SidebarTreeview name="Templates" icon="fa-file-text">
            <SidebarLink to="/templates/create">Create Template</SidebarLink> {/* typeofcampaign (html, plain etc), use template, steps= 1. to who - 2. campaign info (name, from, subject, from email, options for tracking) 3. Template 4. Write the actual email 5. send & confirm*/}
            <SidebarLink to="/templates/manage">Manage Templates</SidebarLink> {/* delete, resend, edit, view report (analytics) */}
          </SidebarTreeview>

          <SidebarTreeview name="Lists" icon="fa-list">
            <SidebarLink to="/lists/create">Create List</SidebarLink> {/* Import from CSV etc. Keep this isolated to importing */}
            <SidebarLink to="/lists/manage">Manage Lists</SidebarLink> {/* RUD, Export list, statistics, add subscriber, duplicate list, combine list */}
          </SidebarTreeview>

          <SidebarTreeview name="Analytics" icon="fa-bar-chart">
            <SidebarLink to="/analytics/overview">Overview TBA</SidebarLink> {/* General overview of all campaigns */}
            <SidebarLink to="/analytics/reports">Campaign Reports</SidebarLink> {/* Bounce rate, click rate, open rate, unsub no., etc */}
          </SidebarTreeview>

          <SidebarTreeview name="Permissions" icon="fa-users">
              <SidebarLink to="/permissions/grant">Grant permissions</SidebarLink> {/* Ability to grant others permissions */}
              <SidebarLink to="/permissions/manage">Manage permissions</SidebarLink> {/* Ability to manage own perimissions */}
          </SidebarTreeview>

          <SidebarLink to="/settings" icon="fa-cog">Settings</SidebarLink>
        </ul>
      </section>
    </aside>
  );
};

Sidebar.propTypes = {
  user: PropTypes.object,
  activeAccount: PropTypes.object.isRequired
};

export default Sidebar;
