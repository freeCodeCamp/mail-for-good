import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import { ManageTemplates } from './ManageTemplates';

const mockProps = (overrides) => ({
  form: {},
  getTemplates: () => {},
  templates: [],
  isGetting: true,
  deleteTemplates: () => {},
  notify: () => {}
});


const mockContext = {
  router: { isActive: (a, b) => true }
};

const wrapper = shallow(<ManageTemplates {...mockProps()} />, { context: mockContext });

describe('(Container) ManageTemplates', () => {
  it('renders without exploding', () => {
    expect(wrapper).to.have.lengthOf(1);
  });
});