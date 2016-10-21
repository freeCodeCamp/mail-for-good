
module.exports = function(req, res) {
  const throughUrl = req.query.url;

  res.redirect(throughUrl);
}
