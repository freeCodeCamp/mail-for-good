import React from 'react';
import Form from 'react-jsonschema-form';

const log = (type) => console.log.bind(console, type);

/*
    Rough guide to questions we need to ask:
        1. Which list to commit the campaign on. Entire list? If not, redirect to lists to create a new list/segment
        2. Descriptive questions (Campaign name, email to, from & subject)
        3. What to send (plainscript for now)
*/

// Ref https://github.com/mozilla-services/react-jsonschema-form

const schema = {
    title: "New Campaign",
    type: "object",
    required: ["title"],
    properties: {
        relayServer: {
            type: "boolean",
            title: "Select a relay server",
            default: false
        },
        title: {
            type: "string",
            title: "Title"
        }
    }
};

const uiSchema = {
    relayServer: {
        "ui:widget": "radio"
    }
}

const formData = {
    "boolean": {
        "default": true,
        "radio": true,
        "select": true
    }
}

const CreateCampaignForm = (props) => {
    // Could turn this into a wizard using the existing schema later on
    return (
            <Form schema={schema}
          uiSchema={uiSchema}
          formData={formData}
          onChange={log("changed")}
          onSubmit={log("submitted")}
          onError={log("errors")}
          />
    );
}

export default CreateCampaignForm;
