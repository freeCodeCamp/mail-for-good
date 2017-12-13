import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import { CreateListComponent } from './CreateList';

const mockProps = ( overrides) => ({ // eslint-disable-line no-unused-vars
  submitCSV: () => {},
  notify: () => {},
  lists: [],
  isGetting: true
});

const mockContext = {
  router: {  isActive: (a, b) => true } // eslint-disable-line no-unused-vars
};

const wrapper = shallow(<CreateListComponent {...mockProps()} />, { context: mockContext });

describe('(Container) CreateList', () => {
  it('renders without exploding', () => {
    expect(wrapper).to.have.lengthOf(1);
  });
});