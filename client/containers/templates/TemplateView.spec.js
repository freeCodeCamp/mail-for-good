import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import { TemplateViewComponent } from './TemplateView';

const mockProps = ( overrides) => ({ // eslint-disable-line no-unused-vars
  notify: () => {},
  getTemplates: () => {},
  templates: [{ slug: 'mockSlug' }],
  isGetting: true,
  params: { slug: 'mockSlug' }
});

const wrapper = shallow(<TemplateViewComponent {...mockProps()} />);

describe('(Container) TemplateView', () => {
  it('renders without exploding', () => {
    expect(wrapper).to.have.lengthOf(1);
  });
});