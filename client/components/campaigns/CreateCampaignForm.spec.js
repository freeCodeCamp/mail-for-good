import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import CreateCampaignForm from './CreateCampaignForm';

const mockProps = ( overrides) => ({ // eslint-disable-line no-unused-vars
  touch: () => {},
  valid: true,
  pristine: true,
  submitting: true,
  nextPage: () => {},
  reset: () => {},
  lists: [],
  templates: [],
  applyTemplate: () => {},
  textEditorType: '',
  passResetToState: () => {},
  initialValues: {},
  ...overrides
});

const wrapper = shallow(<CreateCampaignForm {...mockProps()} />);

describe('(Component) CreateCampaignForm', () => {
  it('renders without exploding', () => {
    expect(wrapper).to.have.lengthOf(1);
  });
});
