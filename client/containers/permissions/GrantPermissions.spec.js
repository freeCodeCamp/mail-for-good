import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import { GrantPermissionsComponent } from './GrantPermissions';

const mockProps = ( overrides) => ({ // eslint-disable-line no-unused-vars
  form: {},
  isPosting: true,
  response: {},
  notify: () => {},
  postGrantPermission: () => {}
});

const wrapper = shallow(<GrantPermissionsComponent {...mockProps()} />);

describe('(Container) GrantPermissions', () => {
  it('renders without exploding', () => {
    expect(wrapper).to.have.lengthOf(1);
  });
});