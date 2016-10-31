import React, { PropTypes } from 'react';

const WSNotification = (props) => { // eslint-disable-line no-unused-vars
  const { message, icon, iconColour} = props;

  return (
    <li>
      <a href="#">
        <i className={`fa ${icon || 'fa-users'} ${iconColour || 'text-green'}`} />
        {message}
      </a>
    </li>
  );
};

WSNotification.propTypes = {
  message: PropTypes.string.isRequired,
  icon: PropTypes.string,
  iconColour: PropTypes.string
};

export default WSNotification;
