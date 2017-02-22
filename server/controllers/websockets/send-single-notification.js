module.exports = function(ioSocket, message, icon, iconColour, newDataToFetch, url) {
  if (ioSocket) {
    const notification = {
      isUpdate: false,
      message,
      icon,
      iconColour,
      newDataToFetch,  // A client side resource to be updated, e.g. 'campaigns'
      url  // User is redirected to this (relative) url when they dismiss a notification
    };

    ioSocket.emit('notification', notification);
  }
};
