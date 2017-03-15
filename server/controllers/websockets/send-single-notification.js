module.exports = function(io, req, notification) {
  req.session.reload(function(err) {
    if (err) {
      console.log(err);
    }
    const socketId = req.session.passport.socket;
    const userSocket = io.sockets.connected[socketId];
    if (userSocket) {
      Object.assign(notification, { isUpdate: false });

      userSocket.emit('notification', notification);
    }
  });
};
