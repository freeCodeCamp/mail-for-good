import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import { CreateCampaign } from './CreateCampaign';

const mockProps = (overrides) => ({
  form: { values: {} },
  isPosting: true,
  postCreateCampaign: () => {},
  getLists: () => {},
  lists: [],
  isGetting: true,
  getTemplates: () => {},
  templates: [],
  initialize: () => {},
  notify: () => {}
});

const mockContext = {
  router: { isActive: (a, b) => true }
};

const wrapper = shallow(<CreateCampaign {...mockProps()} />, { context: mockContext });

describe('(Container) CreateCampaign', () => {
  it('renders without exploding', () => {
    expect(wrapper).to.have.lengthOf(1);
  });
});