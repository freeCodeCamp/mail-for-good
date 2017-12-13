import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import { ManageTemplatesComponent } from './ManageTemplates';

const mockProps = ( overrides) => ({ // eslint-disable-line no-unused-vars
  form: {},
  getTemplates: () => {},
  templates: [],
  isGetting: true,
  deleteTemplates: () => {},
  notify: () => {}
});


const mockContext = {
  router: {  isActive: (a, b) => true } // eslint-disable-line no-unused-vars
};

const wrapper = shallow(<ManageTemplatesComponent {...mockProps()} />, { context: mockContext });

describe('(Container) ManageTemplates', () => {
  it('renders without exploding', () => {
    expect(wrapper).to.have.lengthOf(1);
  });
});