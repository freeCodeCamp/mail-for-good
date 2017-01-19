module.exports = {
  readAccess(req, res, next, permissionPromise) {
    permissionPromise(req.cookies.user, req.user.id)
      .then(object => { // { access: 'Write', 'Read', 'None', userId: '1 ...' }
      // Access prop must equal 'Write'
      if (object.access !== 'Write') {
        throw 'Permission denied';
      } else {
        req.user.id = object.userId;
        next();
        return null;
      }
    });
  },
  writeAccess(req, res, next, permissionPromise) {
    permissionPromise(req.cookies.user, req.user.id)
      .then(object => { // { access: 'Write', 'Read', 'None', userId: '1 ...' }
      // Access prop must not equal 'None'
      if (object.access === 'None') {
        throw 'Permission denied';
      } else {
        req.user.id = object.userId;
        next();
        return null;
      }
    });
  }
};
