/* eslint-disable */
import React from 'react';
import { connect } from 'react-redux';

import { addSubscribers } from '../actions/listActions';

const mapDispatchToProps = { addSubscribers };

export class AddEmailComponent extends React.Component {

  handleSubmit(e) {
    e.preventDefault();

    const subscribers = [{
      email: e.target.email.value
    }];

    this.props.addSubscribers(subscribers, ['email']);
  }

  render() {
    return (
      <div className="content-wrapper">
        <section className="content-header">
          <h1>Add Email <small>Add email page</small></h1>
        </section>

        <section className="content">
          <form action="" onSubmit={this.handleSubmit.bind(this)}>
            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input name="email" type="email" className="form-control" id="email" placeholder="Email" />
            </div>
            <button type="submit" className="btn btn-default">Submit</button>
          </form>
        </section>
      </div>
    );
  }
}

AddEmailComponent.propTypes = {
  addSubscribers: React.PropTypes.func.isRequired
};

export default connect(null, mapDispatchToProps)(AddEmailComponent);