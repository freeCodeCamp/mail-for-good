import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import PreviewTemplateForm from './PreviewTemplateForm';

const mockProps = ( overrides) => ({ // eslint-disable-line no-unused-vars
  handleSubmit: () => {},
  lastPage: () => {},
  form: { values: { emailBody: '' } },
  templateView: {},
  submitting: true,
  ...overrides
});

const wrapper = shallow(<PreviewTemplateForm {...mockProps()} />);

describe('(Component) PreviewTemplateForm', () => {
  it('renders without exploding', () => {
    expect(wrapper).to.have.lengthOf(1);
  });
});