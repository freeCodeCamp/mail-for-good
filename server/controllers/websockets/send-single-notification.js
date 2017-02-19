module.exports = function(ioSocket, message, icon, iconColour) {
  if (ioSocket) {
    const notification = {
      isUpdate: false,
      message,
      icon,
      iconColour
    };

    ioSocket.emit('notification', notification);
  }
};
