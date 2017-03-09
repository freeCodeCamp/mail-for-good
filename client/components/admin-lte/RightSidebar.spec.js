import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import RightSidebar from './RightSidebar';

const mockProps = ( overrides) => ({ // eslint-disable-line no-unused-vars
  touch: () => {},
  valid: true,
  pristine: true,
  submitting: true,
  changeAccount: () => {},
  changeAccountToSelf: () => {},
  isGettingActivePermissions: true,
  activePermissionsEmails: [],
  activeAccount: {},
  ...overrides
});

const wrapper = shallow(<RightSidebar {...mockProps()} />);

describe('(Component) RightSidebar', () => {
  it('renders without exploding', () => {
    expect(wrapper).to.have.lengthOf(1);
  });
});
