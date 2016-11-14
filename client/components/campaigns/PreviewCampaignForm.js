import React, { PropTypes } from 'react';
import DOMPurify from 'dompurify';

const PreviewCampaignForm = props => {
  const { handleSubmit, lastPage, form:{ values: form } } = props;
  // { listName, campaignName, fromName, fromEmail, emailSubject, emailBody, type }
  const cleanHtml = DOMPurify.sanitize(form.emailBody); // Purify xss to prevent xss attacks

  return (
    <div>
      <h3><i className="fa fa-list text-green" aria-hidden="true" /> - {form.listName}</h3>
      <h3><i className="fa fa-flag text-green" aria-hidden="true" /> - {form.campaignName}</h3>

      <hr />

      <h3>From - {`${form.fromName} <${form.fromEmail}>`}</h3>
      <h4>Subject - {`${form.emailSubject}`}</h4>
      <blockquote>
        <div dangerouslySetInnerHTML={{ __html: cleanHtml }} />
      </blockquote>

      <hr />

      <div className="box-footer">
        <button className="btn btn-lg btn-primary pull-left" type="button" onClick={lastPage}>Go back</button>
        <button className="btn btn-lg btn-success pull-right" type="button" onClick={handleSubmit}>Create</button>
      </div>
    </div>
  );
};

PreviewCampaignForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  lastPage: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
};

export default PreviewCampaignForm;
