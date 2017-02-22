import React, { PropTypes } from 'react';
import { Link } from 'react-router';

const WSNotification = props => { // eslint-disable-line no-unused-vars
  const { message, icon, iconColour, consumeNotification, index, url } = props;
  return (
    <li onClick={() => consumeNotification(index)}>
      <Link to={url || '#'}>
        <i className={`fa ${icon || 'fa-users'} ${iconColour || 'text-green'}`} />
        {message}
      </Link>
    </li>
  );
};

WSNotification.propTypes = {
  message: PropTypes.string.isRequired,
  icon: PropTypes.string,
  iconColour: PropTypes.string,
  consumeNotification: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired
};

export default WSNotification;
