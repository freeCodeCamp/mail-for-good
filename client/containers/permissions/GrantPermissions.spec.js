import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import { GrantPermissions } from './GrantPermissions';

const mockProps = (overrides) => ({
  form: {},
  isPosting: true,
  response: {},
  notify: () => {},
  postGrantPermission: () => {}
});

const wrapper = shallow(<GrantPermissions {...mockProps()} />);

describe('(Container) GrantPermissions', () => {
  it('renders without exploding', () => {
    expect(wrapper).to.have.lengthOf(1);
  });
});