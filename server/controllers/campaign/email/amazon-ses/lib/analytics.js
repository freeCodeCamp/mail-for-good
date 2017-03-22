/**
 * @description Add tracking info such as an unsubcribe link or tracking pixel where necessary
 * @param {string} body - The body of the email
 * @param {string} trackingId - Pre-configured tracking id for this email
 * @param {string} type - The type of this email, either Plaintex or Html
 * @param {string} whiteLabelUrl - Pre-configured white label url for this email
 * @return {object} Object with bound functions as props
 */

function wrapLink(body, trackingId, type, whiteLabelUrl) {
  const host = whiteLabelUrl || process.env.PUBLIC_HOSTNAME;

  if (type === 'Plaintext') {  // skip link tracking for plaintext for now
    return body;
  }

  body = body.replace(/\{(.+?)\/(.+?)\}/g, function(m, label, url) {

    return `<a href="${host}/clickthrough?url=${url}&trackingId=${trackingId}">${label}</a>`
  });
  return body;
}

function insertUnsubscribeLink(body, unsubscribeId, type, whiteLabelUrl) {
  const host = whiteLabelUrl || process.env.PUBLIC_HOSTNAME;

  const unsubscribeUrl = `${host}/unsubscribe/${unsubscribeId}`;

  if (type === 'Plaintext') {
    return body + '\t\r\n\t\r\n\t\r\n\t\r\n\t\r\n\t\r\n' + unsubscribeUrl;
  }

  return body + "<br/><br/><br/><br/><br/>" + `<a href="${unsubscribeUrl}">unsubscribe</a>`
}

function insertTrackingPixel(body, trackingId, type, whiteLabelUrl) {
  const host = whiteLabelUrl || process.env.PUBLIC_HOSTNAME;

  if (type === 'Plaintext') {
    return body;
  }

  return body +
    `\n<img src="${host}/trackopen?trackingId=${trackingId}" style="display:none">`
}

module.exports = {
  wrapLink,
  insertUnsubscribeLink,
  insertTrackingPixel
}
