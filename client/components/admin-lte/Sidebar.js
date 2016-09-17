// Must have at least one test file in this directory or Mocha will throw an error.
import React from 'react';

const Sidebar = (props) => {
  return (
    <aside className="main-sidebar">
        <section className="sidebar">
            <div className="user-panel">
                <div className="pull-left image"><img className="img-circle" src="dist/img/user2-160x160.jpg" alt="User Image" /></div>
                <div className="pull-left info">
                    <p>Alexander Pierce</p>
                    <a href="#"> Online</a></div>
            </div>
            <form className="sidebar-form" action="#" method="get">
                <div className="input-group">
                  <input className="form-control" name="q" type="text" placeholder="Search..." />
                  <span className="input-group-btn">
                    <button id="search-btn" className="btn btn-flat" name="search" type="submit" />
                  </span>
                </div>
            </form>
            <ul className="sidebar-menu">
                <li className="header">HEADER</li>
                <li className="active"><a href="#"> Link</a></li>
                <li><a href="#"> Another Link</a></li>
                <li className="treeview"><a href="#"> Multilevel </a>
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
