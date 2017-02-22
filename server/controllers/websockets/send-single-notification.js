module.exports = function(ioSocket, message, icon, iconColour, newDataToFetch) {
  if (ioSocket) {
    const notification = {
      isUpdate: false,
      message,
      icon,
      iconColour,
      newDataToFetch
    };

    ioSocket.emit('notification', notification);
  }
};
