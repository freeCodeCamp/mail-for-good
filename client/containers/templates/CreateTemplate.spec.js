import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import { CreateTemplateComponent } from './CreateTemplate';

const mockProps = ( overrides) => ({ // eslint-disable-line no-unused-vars
  form: { values: {} },
  isPosting: true,
  postCreateTemplate: () => {},
  templates: [],
  isGetting: true,
  notify: () => {}
});

const wrapper = shallow(<CreateTemplateComponent {...mockProps()} />);

describe('(Container) CreateTemplate', () => {
  it('renders without exploding', () => {
    expect(wrapper).to.have.lengthOf(1);
  });
});