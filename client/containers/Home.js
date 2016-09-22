import React from 'react';

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

export default class Home extends React.Component {
  render() {
    return (

        <div>
            <section className="content-header">
                <h1>Page Header <small>Home page</small></h1>
            </section>
            <section className="content">
              <p> Home page content will go here. </p>
            </section>
        </div>

    )
  }
}
