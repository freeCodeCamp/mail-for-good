import React, { PropTypes } from 'react';
import showdown from 'showdown'; // Lib to convert from markdown to html
import DOMPurify from 'dompurify';

const PreviewTemplateForm = props => {
  const { handleSubmit, lastPage } = props;

  if (props.form) {
    var { form:{ values: form } } = props; // eslint-disable-line
  } else {
    // In this case, the preview is rendered within the TemplateView container
    // We may receive markdown or html from the server. If it's markdown, we'll need to convert it using showdown.
    form = props.templateView; // eslint-disable-line
    if (props.templateView.type === 'Plaintext') {
      form.emailBody = new showdown.Converter().makeHtml(props.templateView.emailBody); // eslint-disable-line
    }
  }
  // { listName, templateName, fromName, fromEmail, emailSubject, emailBody, type }
  const cleanHtml = DOMPurify.sanitize(form.emailBody); // Purify xss to prevent xss attacks

  return (
    <div>
      <h3><i className="fa fa-list text-green" aria-hidden="true" /> - {form.templateName || 'Not set'}</h3>

      <hr />

      <h3><strong>From: {`${form.fromName || 'Not set'} <${form.fromEmail || 'Not set'}>`}</strong></h3>
      <h4><strong>Subject: {`${form.emailSubject || 'Not set'}`}</strong></h4>
      <blockquote>
        <div dangerouslySetInnerHTML={{ __html: cleanHtml }} />
      </blockquote>

      <hr />

      {(lastPage && handleSubmit) &&
        <div className="box-footer">
          <button className="btn btn-lg btn-success pull-left" type="button" onClick={handleSubmit}>Save Template</button>
          <button className="btn btn-lg btn-primary pull-right" type="button" onClick={lastPage}>Go back</button>
        </div>}

    </div>
  );
};

PreviewTemplateForm.propTypes = {
  handleSubmit: PropTypes.func,
  lastPage: PropTypes.func,
  form: PropTypes.object,
  templateView: PropTypes.object
};

export default PreviewTemplateForm;
