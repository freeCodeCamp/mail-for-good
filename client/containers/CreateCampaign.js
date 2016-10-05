import React, {Component, PropTypes} from 'react';
import Form from 'react-jsonschema-form';

<<<<<<< HEAD
=======
//import { submitCSV } from '../actions/listActions';

>>>>>>> b5ec80557d404fc308a9ea0ae70ef96393ab35c0
const schema = {
  title: "Todo",
  type: "object",
  required: ["title"],
  properties: {
    title: {type: "string", title: "Title", default: "A new task"},
    done: {type: "boolean", title: "Done?", default: false}
  }
};

<<<<<<< HEAD
//@connect(null, null)
export default class CreateList extends Component {

=======
//@connect(null, { submitCSV })
export default class CreateList extends Component {

  static propTypes = {
    submitCSV: PropTypes.func
  }

>>>>>>> b5ec80557d404fc308a9ea0ae70ef96393ab35c0
  render() {
    return (
        <Form schema={schema}
      onChange={log("changed")}
      onSubmit={log("submitted")}
      onError={log("errors")} />

    );
  }

}
