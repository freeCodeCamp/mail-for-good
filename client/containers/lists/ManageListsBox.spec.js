import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import { ManageListsBox } from './ManageListsBox';

const mockProps = (overrides) => ({
  getLists: () => {},
  lists: [],
  isGetting: true,
  deleteLists: () => {}
});

const wrapper = shallow(<ManageListsBox {...mockProps()} />);

describe('(Container) ManageListsBox', () => {
  it('renders without exploding', () => {
    expect(wrapper).to.have.lengthOf(1);
  });
});