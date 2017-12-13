import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import GrantPermissionForm from './GrantPermissionForm';

const mockProps = ( overrides) => ({ // eslint-disable-line no-unused-vars
  touch: () => {},
  valid: true,
  pristine: true,
  submitting: true,
  reset: () => {},
  handleSubmit: () => {},
  ...overrides
});

const wrapper = shallow(<GrantPermissionForm {...mockProps()} />);

describe('(Component) GrantPermissionForm', () => {
  it('renders without exploding', () => {
    expect(wrapper).to.have.lengthOf(1);
  });
});