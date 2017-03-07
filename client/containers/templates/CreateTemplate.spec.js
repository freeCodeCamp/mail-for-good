import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import { CreateTemplate } from './CreateTemplate';

const mockProps = (overrides) => ({
  form: { values: {} },
  isPosting: true,
  postCreateTemplate: () => {},
  getTemplates: () => {},
  templates: [],
  isGetting: true,
  notify: () => {}
});

const wrapper = shallow(<CreateTemplate {...mockProps()} />);

describe('(Container) CreateTemplate', () => {
  it('renders without exploding', () => {
    expect(wrapper).to.have.lengthOf(1);
  });
});