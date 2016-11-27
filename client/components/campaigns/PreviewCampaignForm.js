import React, { PropTypes } from 'react';
import DOMPurify from 'dompurify';

const PreviewCampaignForm = props => {
  const { handleSubmit, lastPage } = props;
  if (props.form) {
    var { form:{ values: form } } = props;
  } else {
    var form = props.campaignView;
  }
  // { listName, campaignName, fromName, fromEmail, emailSubject, emailBody, type }
  const cleanHtml = DOMPurify.sanitize(form.emailBody); // Purify xss to prevent xss attacks

  return (
    <div>
      {form.listName && <h3><i className="fa fa-list text-green" aria-hidden="true" /> - {form.listName}</h3>}
      <h3><i className="fa fa-flag text-green" aria-hidden="true" /> - {form.campaignName || form.name}</h3>

      <hr />

      <h3>From - {`${form.fromName} <${form.fromEmail}>`}</h3>
      <h4>Subject - {`${form.emailSubject}`}</h4>
      <blockquote>
        <div dangerouslySetInnerHTML={{ __html: cleanHtml }} />
      </blockquote>

      <hr />

      {(lastPage && handleSubmit) &&
      <div className="box-footer">
        <button className="btn btn-lg btn-success pull-left" type="button" onClick={handleSubmit}>Create Campaign</button>
        <button className="btn btn-lg btn-primary pull-right" type="button" onClick={lastPage}>Go back</button>
      </div>}
    </div>
  );
};

PreviewCampaignForm.propTypes = {
  handleSubmit: PropTypes.func,
  lastPage: PropTypes.func,
  form: PropTypes.object
};

export default PreviewCampaignForm;
