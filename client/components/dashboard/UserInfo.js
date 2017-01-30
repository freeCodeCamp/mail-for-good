import React, { PropTypes } from 'react';

const UserInfo = props => {
  const { user, totalSentCount } = props;
  return (
    <div className="box box-primary">
      <div className="box-header">
        <h3 className="box-title">{`Welcome ${user.name}`}</h3>
      </div>

      <div className="box-body">
        <p>{user.email}</p>
        <p>Total emails sent: {totalSentCount}</p>
      </div>
    </div>
  );
};

UserInfo.propTypes = {
  user: PropTypes.object.isRequired,
  totalSentCount: PropTypes.number
};

export default UserInfo;
