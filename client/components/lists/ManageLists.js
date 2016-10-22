import React from 'react';

import ManageListsBox from '../../containers/lists/ManageListsBox';

const ManageLists = () => {
  return (
    <div>
      <div className="content-header">
        <h1>Manage lists
          <small>Edit, delete and segement your lists here</small>
        </h1>
      </div>

      <section className="content">
        <ManageListsBox />
      </section>
    </div>
  );
};

export default ManageLists;
