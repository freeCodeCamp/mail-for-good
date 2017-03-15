module.exports = function(io, req, notification) {
  console.log('fired');
  req.session.reload(function(err) {
    if (err) {
      console.log(err);
    }
    const socketId = req.session.passport.socket;
    console.log(socketId);
    const userSocket = io.sockets.connected[socketId];
    console.log('fired_before');
    if (userSocket) {
      console.log('fired_after');
      Object.assign(notification, { isUpdate: true });

      userSocket.emit('notification', notification);
    }
  });
};
