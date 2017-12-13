import React from 'react';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';
import { Link } from 'react-router';

const WSNotification = props => { // eslint-disable-line no-unused-vars
  const { message, icon, iconColour, consumeNotification, index, url } = props;
  return (
    <li onClick={() => consumeNotification(index)}>
      <Link to={url || '#'}>
        <a data-tip={message} data-for={`ws-${index}`}>
          <i className={`fa ${icon || 'fa-users'} ${iconColour || 'text-green'}`} /> {message}
        </a>
      </Link>

      <ReactTooltip id={`ws-${index}`} place="top" type="dark" effect="float" />
    </li>
  );
};

WSNotification.propTypes = {
  message: PropTypes.string.isRequired,
  icon: PropTypes.string,
  iconColour: PropTypes.string,
  consumeNotification: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  url: PropTypes.string
};

export default WSNotification;
