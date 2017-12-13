import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import { ManageListSubscribersComponent } from './ManageListSubscribers';

const mockProps = ( overrides) => ({ // eslint-disable-line no-unused-vars
  subscribers: [],
  isGetting: true,
  deleteListSubscribers: () => {},
  getListSubscribers: () => {},
  params: { listId: 0 },
  totalListSubscribers: 0,
  additionalFields: []
});

const wrapper = shallow(<ManageListSubscribersComponent {...mockProps()} />);

describe('(Container) ManageListSubscribers', () => {
  it('renders without exploding', () => {
    expect(wrapper).to.have.lengthOf(1);
  });
});