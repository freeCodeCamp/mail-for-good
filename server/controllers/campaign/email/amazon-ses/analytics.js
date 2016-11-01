const clickthroughHost = 'http://localhost:8080';  // placeholder

function wrapLink(body, trackingId, type) {
  if (type === 'Plaintext') {  // skip link tracking for plaintext for now
    return body;
  }

  body = body.replace(/\{(.+?)\/(.+?)\}/g, function(m, label, url) {

    return `<a href="${clickthroughHost}/clickthrough?url=${url}&trackingId=${trackingId}">${label}</a>`
  });
  return body;
}

function insertUnsubscribeLink(body, unsubscribeId, type) {
  const unsubscribeUrl = `${clickthroughHost}/unsubscribe/${unsubscribeId}`;
  if (type === 'Plaintext') {
    return body + '\n' + unsubscribeUrl;
  }

  return body + `\n<a href="${unsubscribeUrl}">unsubscribe</a>`
}

function insertTrackingPixel(body, trackingId, type) {
  if (type === 'Plaintext') {
    return body;
  }

  return body +
    `\n<img src="${clickthroughHost}/trackopen?trackingId=${trackingId}" style="display:none">`
}

module.exports = {
  wrapLink,
  insertUnsubscribeLink,
  insertTrackingPixel
}
