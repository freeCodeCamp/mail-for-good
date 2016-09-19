import React from 'react';
import { Link } from 'react-router';

/*export default class App extends React.Component {
  render() {
    return (
      <div>
        <h1>Hello World!</h1>

        <Link to="settings">settings</Link>
        {this.props.children}
      </div>
    );
  }
}

App.propTypes = {
  children: React.PropTypes.element.isRequired
};

*/

import Header from '../components/admin-lte/Header.js';
import Sidebar from '../components/admin-lte/Sidebar.js';
import Footer from '../components/admin-lte/Footer.js';

export default class App extends React.Component {
  render() {
    return (
      <div className="wrapper">
      <Header />
      <Sidebar />

        <div className="content-wrapper">
            <section className="content-header">
                <h1>Page Header <small>Optional description</small></h1>
            </section>
            <section className="content">
              <p> Hello world! </p>
            </section>
        </div>

      <Footer />
      </div>
    )
  }
}
