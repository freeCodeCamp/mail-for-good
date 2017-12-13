import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import TextEditorPlain from './TextEditorPlain';

const mockProps = ( overrides) => ({ // eslint-disable-line no-unused-vars
  value: '',
  onChange: () => {},
  ...overrides
});

const wrapper = shallow(<TextEditorPlain {...mockProps()} />);

describe('(Component) TextEditorPlain', () => {
  it('renders without exploding', () => {
    expect(wrapper).to.have.lengthOf(1);
  });
});