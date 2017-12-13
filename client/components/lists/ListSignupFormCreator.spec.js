import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import { ListSignupFormCreatorComponent } from './ListSignupFormCreator';

const mockProps = ( overrides) => ({ // eslint-disable-line no-unused-vars
  showModal: true,
  subscribeKey: '',
  notify: () => {},
  ...overrides
});

const wrapper = shallow(<ListSignupFormCreatorComponent {...mockProps()} />);

describe('(Component) ListSignupFormCreator', () => {
  it('renders without exploding', () => {
    expect(wrapper).to.have.lengthOf(1);
  });
});