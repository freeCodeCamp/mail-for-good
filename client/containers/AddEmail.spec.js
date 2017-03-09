import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import { AddEmailComponent } from './AddEmail';

const mockProps = ( overrides) => ({ // eslint-disable-line no-unused-vars
  addSubscribers: () => {}
});

const wrapper = shallow(<AddEmailComponent {...mockProps()} />);

describe('(Container) AddEmail', () => {
  it('renders without exploding', () => {
    expect(wrapper).to.have.lengthOf(1);
  });
});