import React, { PropTypes } from 'react';
import DOMPurify from 'dompurify';

const PreviewCampaignForm = props => {
  const { handleSubmit, lastPage } = props;
  const isCreateCampaignPreview = !!props.form;
  let text;
  let form;
  let type;
  if (isCreateCampaignPreview) {
    // form = { listName, campaignName, fromName, fromEmail, emailSubject, emailBodyPlaintext OR emailBodyHTML, type }
    form = props.form.values;
    type = form.type;
    if (type === 'Plaintext') {
      text = form.emailBody ? form.emailBody : form[`emailBody${form.type}`];
    } else {
      text = DOMPurify.sanitize(form.emailBody ? form.emailBody : form[`emailBody${form.type}`]); // Purify to prevent xss attacks
    }
  } else {
    // In this case, the preview is rendered within the CampaignView container
    // We may receive plaintext or html from the server.
    form = props.campaignView;
    type = form.type;
    text = props.campaignView.emailBody;
  }

  return (
    <div>
      {form.listName && <h3><i className="fa fa-list text-green" aria-hidden="true" /> - {form.listName}</h3>}
      <h3><i className="fa fa-flag text-green" aria-hidden="true" /> - {form.campaignName || form.name}</h3>

      <hr />

      <h4><strong>From: {`${form.fromName} <${form.fromEmail}>`}</strong></h4>
      <h4><strong>Subject: {`${form.emailSubject}`}</strong></h4>
      {type === 'HTML'
      ?

      <blockquote>
        <div dangerouslySetInnerHTML={{ __html: text }} />
      </blockquote>

      :

      <textarea
        className="form-control"
        disabled
        style={{ width: "100%", minHeight: "60vh" }}
        value={text} />
      }

      {!isCreateCampaignPreview && <hr />}
      {(lastPage && handleSubmit) &&
      <div className="box-footer">
        <div className="btn-group">
          <button style={{ margin: "1em", width: "200px" }} className="btn btn-lg btn-success" type="button" onClick={handleSubmit}>Create Campaign</button>
          <button style={{ margin: "1em", width: "200px" }} className="btn btn-lg btn-primary" type="button" onClick={lastPage}>Go back</button>
        </div>
      </div>}

    </div>
  );
};

PreviewCampaignForm.propTypes = {
  handleSubmit: PropTypes.func,
  lastPage: PropTypes.func,
  form: PropTypes.object,
  campaignView: PropTypes.object
};

export default PreviewCampaignForm;
