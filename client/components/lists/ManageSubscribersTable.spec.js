import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import ManageSubscribersTable from './ManageSubscribersTable';

const mockProps = (overrides) => ({
  data: [],
  deleteRows: () => {},
  onPageChange: () => {},
  additionalFields: [],
  listId: 0,
  total: 0,
  ...overrides
});

const wrapper = shallow(<ManageSubscribersTable {...mockProps()} />);

describe('(Component) ManageSubscribersTable', () => {
  it('renders without exploding', () => {
    expect(wrapper).to.have.lengthOf(1);
  });
});