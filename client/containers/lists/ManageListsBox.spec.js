import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import { ManageListsBoxComponent } from './ManageListsBox';

const mockProps = ( overrides) => ({ // eslint-disable-line no-unused-vars
  getLists: () => {},
  lists: [],
  isGetting: true,
  deleteLists: () => {}
});

const wrapper = shallow(<ManageListsBoxComponent {...mockProps()} />);

describe('(Container) ManageListsBox', () => {
  it('renders without exploding', () => {
    expect(wrapper).to.have.lengthOf(1);
  });
});