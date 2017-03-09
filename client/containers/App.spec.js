import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import { App } from './App';

const mockProps = (overrides) => ({
  children: <div></div>,
  user: {},
  ws_notification: [],
  isGettingActivePermissions: true,
  activePermissionsEmails: [],
  accountForm: {},
  activeAccount: {},
  emitProfileRequest: () => {},
  consumeNotification: () => {},
  getActivePermissions: () => {},
  becomeAnotherUser: () => {},
  becomeSelf: () => {},
  route: {},
  location: { pathname: '' }
});

const mockContext = {
  router: { isActive: (a, b) => true }
};

const wrapper = shallow(<App {...mockProps()} />, { context: mockContext });

describe('(Container) App', () => {
  it('renders without exploding', () => {
    expect(wrapper).to.have.lengthOf(1);
  });
});