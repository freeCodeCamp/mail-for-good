const clickThroughBaseUrl = 'localhost:8080';  // placeholder


module.exports = (str, trackingId) => {
  str = str.replace(/\{(.+?)\/(.+?)\}/g, function(m, label, url) {
    return '<a href="http://' + clickThroughBaseUrl + '/clickthrough?url=' + url + '&trackingId=' + trackingId + '">' + label + '</a>';
  });
  return str;
}
