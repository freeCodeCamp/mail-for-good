import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import { CreateList } from './CreateList';

const mockProps = (overrides) => ({
  submitCSV: () => {},
  notify: () => {},
  lists: [],
  isGetting: true
});

const mockContext = {
  router: { isActive: (a, b) => true }
};

const wrapper = shallow(<CreateList {...mockProps()} />, { context: mockContext });

describe('(Container) CreateList', () => {
  it('renders without exploding', () => {
    expect(wrapper).to.have.lengthOf(1);
  });
});