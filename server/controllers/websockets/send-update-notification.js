module.exports = function(ioSocket, message, icon, iconColour, id) {
  if (ioSocket) {
    const notification = {
      isUpdate: true, // Mark this notification as an update for an existing notification to the client
      message,
      id, // Unique identified for use on client side (in the reducer)
      icon,
      iconColour
    };

    if (ioSocket) {
      ioSocket.emit('notification', notification);
    }
  }
};
