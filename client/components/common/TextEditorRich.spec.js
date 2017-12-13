import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import TextEditorRich from './TextEditorRich';

const mockProps = ( overrides) => ({ // eslint-disable-line no-unused-vars
  value: '',
  onChange: () => {},
  ...overrides
});

const wrapper = shallow(<TextEditorRich {...mockProps()} />);

describe('(Component) TextEditorRich', () => {
  it('renders without exploding', () => {
    expect(wrapper).to.have.lengthOf(1);
  });
});