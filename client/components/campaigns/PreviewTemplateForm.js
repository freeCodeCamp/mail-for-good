import React, { PropTypes } from 'react';
import DOMPurify from 'dompurify';

const PreviewCampaignForm = props => {
  const { handleSubmit, lastPage, form:{ values: form } } = props;
  // { templateName, fromName (OPTIONAL), fromEmail (OPTIONAL), emailSubject (OPTIONAL), emailBody, type }
  const cleanHtml = DOMPurify.sanitize(form.emailBody); // Purify xss to prevent xss attacks

  return (
    <div>
      <h3><i className="fa fa-list text-green" aria-hidden="true" /> - {form.templateName}</h3>

      <hr />

      <h3>From - {`${form.fromName || 'Not set'} <${form.fromEmail || 'Not set'}>`}</h3>
      <h4>Subject - {`${form.emailSubject || 'Not set'}`}</h4>
      <blockquote>
        <div dangerouslySetInnerHTML={{ __html: cleanHtml }} />
      </blockquote>

      <hr />

      <button className="btn btn-lg btn-primary pull-left" type="button" onClick={lastPage}>Go back</button>
      <button className="btn btn-lg btn-success pull-right" type="button" onClick={handleSubmit}>Save as a template</button>

    </div>
  );
};

PreviewCampaignForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  lastPage: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
};

export default PreviewCampaignForm;
