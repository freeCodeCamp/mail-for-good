const Template = require('../../models').template;

module.exports = (req, res) => {
  const templateIds = req.body.data;

  Template.destroy({
    where: {
      id: { in: templateIds },
      userId: req.user.id
    }
  }).then(numDeleted => {
    if (numDeleted) {
      res.send();
    } else {
      res.status(404).send();
    }
  }).catch(() => {
    res.status(500).send();
  });
};
