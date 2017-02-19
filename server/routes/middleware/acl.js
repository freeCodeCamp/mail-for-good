module.exports = {
  readAccess(req, res, next, permissionPromise) {
    // If no user cookie was set, continue
    if (!req.cookies.user) {
      next();
    } else {
      permissionPromise(req.cookies.user, req.user.id)
        .then(object => { // { access: 'Write', 'Read', 'None', userId: '1 ...' }
        // Access prop must equal 'Write'
        if (object.access === 'None') {
          res.status(400).send();
          throw `Permission denied - readAccess not granted - ${object.access} from ${req.user.id} to ${object.userId}`;
        } else {
          req.user.dataValues.id = object.userId;
          return next();
        }
      });
    }
  },
  writeAccess(req, res, next, permissionPromise) {
    // If no user cookie was set, continue
    if (!req.cookies.user) {
      next();
    } else {
      permissionPromise(req.cookies.user, req.user.id)
        .then(object => { // { access: 'Write', 'Read', 'None', userId: '1 ...' }
        // Access prop must not equal 'None'
        if (object.access !== 'Write') {
          res.status(400).send();
          throw `Permission denied - writeAccess not granted - ${object.access} from ${req.user.id} to ${object.userId}`;
        } else {
          req.user.dataValues.id = object.userId;
          return next();
        }
      });
    }
  }
};
