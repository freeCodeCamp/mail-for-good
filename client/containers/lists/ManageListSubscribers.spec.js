import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import { ManageListSubscribers } from './ManageListSubscribers';

const mockProps = (overrides) => ({
  subscribers: [],
  isGetting: true,
  deleteListSubscribers: () => {},
  getListSubscribers: () => {},
  params: { listId: 0 },
  totalListSubscribers: 0,
  additionalFields: []
});

const wrapper = shallow(<ManageListSubscribers {...mockProps()} />);

describe('(Container) ManageListSubscribers', () => {
  it('renders without exploding', () => {
    expect(wrapper).to.have.lengthOf(1);
  });
});