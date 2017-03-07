import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import { TemplateView } from './TemplateView';

const mockProps = (overrides) => ({
  notify: () => {},
  getTemplates: () => {},
  templates: [{ slug: 'mockSlug' }],
  isGetting: true,
  params: { slug: 'mockSlug' }
});

const wrapper = shallow(<TemplateView {...mockProps()} />);

describe('(Container) TemplateView', () => {
  it('renders without exploding', () => {
    expect(wrapper).to.have.lengthOf(1);
  });
});