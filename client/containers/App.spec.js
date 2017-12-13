import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import { AppComponent } from './App';

const mockProps = ( overrides) => ({ // eslint-disable-line no-unused-vars
  children: <div />,
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
  router: {  isActive: (a, b) => true } // eslint-disable-line no-unused-vars
};

const wrapper = shallow(<AppComponent {...mockProps()} />, { context: mockContext });

describe('(Container) App', () => {
  it('renders without exploding', () => {
    expect(wrapper).to.have.lengthOf(1);
  });
});