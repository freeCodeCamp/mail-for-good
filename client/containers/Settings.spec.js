import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import { SettingsComponent } from './Settings';

const mockProps = ( overrides) => ({ // eslint-disable-line no-unused-vars
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

const wrapper = shallow(<SettingsComponent {...mockProps()} />);

describe('(Container) Settings', () => {
  it('renders without exploding', () => {
    expect(wrapper).to.have.lengthOf(1);
  });
});