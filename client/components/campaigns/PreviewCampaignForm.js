import React from 'react';

const PreviewCampaignForm = props => {
  const { handleSubmit, lastPage, form:{ values: form } } = props;
  // { listName, campaignName, fromName, fromEmail, emailSubject, emailBody }
  return (
    <div>
      <h3><i className="fa fa-list text-green" aria-hidden="true"></i> - {form.listName}</h3>
      <h3><i className="fa fa-flag text-green" aria-hidden="true"></i> - {form.campaignName}</h3>

      <hr />

      <h3>From - {`${form.fromName} <${form.fromEmail}>`}</h3>
      <h4>Subject - {`${form.emailSubject}`}</h4>
      <blockquote>
        <p>
          {form.emailBody}
        </p>
      </blockquote>

      <hr />

      <button className="btn btn-lg btn-primary pull-left" type="button" onClick={lastPage}>Go back</button>
      <button className="btn btn-lg btn-success pull-right" type="button" onClick={handleSubmit}>Create</button>

    </div>
  );
};

export default PreviewCampaignForm;
