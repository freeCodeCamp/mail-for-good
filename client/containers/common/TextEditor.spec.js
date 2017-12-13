import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import TextEditor from './TextEditor';

const mockProps = ( overrides) => ({ // eslint-disable-line no-unused-vars
  input: {},
  textEditorType: ''
});

const wrapper = shallow(<TextEditor {...mockProps()} />);

describe('(Container) TextEditor', () => {
  it('renders without exploding', () => {
    expect(wrapper).to.have.lengthOf(1);
  });
});