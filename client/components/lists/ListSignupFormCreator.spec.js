import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import { ListSignupFormCreator } from './ListSignupFormCreator';

const mockProps = (overrides) => ({
  showModal: true,
  subscribeKey: '',
  notify: () => {},
  ...overrides
});

const wrapper = shallow(<ListSignupFormCreator {...mockProps()} />);

describe('(Component) ListSignupFormCreator', () => {
  it('renders without exploding', () => {
    expect(wrapper).to.have.lengthOf(1);
  });
});