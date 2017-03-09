import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import { Settings } from './Settings';

const mockProps = (overrides) => ({
  getBooleanForAssignedSettings: () => {},
  changeSettings: () => {},
  notify: () => {},
  loading: true,
  fieldsExist: {},
  touch: () => {},
  valid: true,
  pristine: true,
  submitting: true,
  reset: () => {}
});

const wrapper = shallow(<Settings {...mockProps()} />);

describe('(Container) Settings', () => {
  it('renders without exploding', () => {
    expect(wrapper).to.have.lengthOf(1);
  });
});