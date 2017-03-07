import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import CreateTemplateForm from './CreateTemplateForm';

const mockProps = (overrides) => ({
  touch: () => {},
  valid: true,
  pristine: true,
  submitting: true,
  nextPage: () => {},
  reset: () => {},
  validationFailed: () => {},
  textEditorType: '',
  passResetToState: () => {},
  clearTextEditor: () => {},
  ...overrides
});

const wrapper = shallow(<CreateTemplateForm {...mockProps()} />);

describe('(Component) CreateTemplateForm', () => {
  it('renders without exploding', () => {
    expect(wrapper).to.have.lengthOf(1);
  });
});