import React, { PropTypes } from 'react';
import DOMPurify from 'dompurify';

const PreviewTemplateForm = props => {
  const { handleSubmit, lastPage, submitting } = props;
  const isCreateTemplatePreview = !!props.form;
  let text;
  let form;
  let type;

  if (isCreateTemplatePreview) {
    // form = { listName, campaignName, fromName, fromEmail, emailSubject, emailBody, type }
    form = props.form.values;
    type = form.type;
    if (type === 'Plaintext') {
      text = form.emailBody;
    } else {
      text = DOMPurify.sanitize(form.emailBody); // Purify to prevent xss attacks
    }
  } else {
    // In this case, the preview is rendered within the CampaignView container
    // We may receive plaintext or html from the server.
    form = props.templateView;
    type = form.type;
    text = props.templateView.emailBody;
  }

  return (
    <div>
      <h3><i className="fa fa-list text-green" aria-hidden="true" /> - {form.templateName || 'Not set'}</h3>

      <hr />

      <h3><strong>From: {`${form.fromName || 'Not set'} <${form.fromEmail || 'Not set'}>`}</strong></h3>
      <h4><strong>Subject: {`${form.emailSubject || 'Not set'}`}</strong></h4>

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

      <hr />

      {(lastPage && handleSubmit) &&
        <div className="box-footer">
          <button style={{ margin: "1em", width: "160px" }} className="btn btn-lg btn-success" type="button" onClick={handleSubmit} disabled={submitting}>{submitting ? 'Saving Template' : 'Save Template'}</button>
          <button style={{ margin: "1em", width: "160px" }} className="btn btn-lg btn-primary" type="button" onClick={lastPage}>Go back</button>
        </div>}

    </div>
  );
};

PreviewTemplateForm.propTypes = {
  handleSubmit: PropTypes.func,
  lastPage: PropTypes.func,
  form: PropTypes.object,
  templateView: PropTypes.object,
  submitting: PropTypes.bool
};

export default PreviewTemplateForm;
