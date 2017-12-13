import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import ManageListsTable from './ManageListsTable';

const mockProps = ( overrides) => ({ // eslint-disable-line no-unused-vars
  data: [],
  deleteRows: () => {},
  ...overrides
});

const wrapper = shallow(<ManageListsTable {...mockProps()} />);

describe('(Component) ManageListsTable', () => {
  it('renders without exploding', () => {
    expect(wrapper).to.have.lengthOf(1);
  });
});