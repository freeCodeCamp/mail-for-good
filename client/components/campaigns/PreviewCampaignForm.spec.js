import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import PreviewCampaignForm from './PreviewCampaignForm';

const mockProps = ( overrides) => ({ // eslint-disable-line no-unused-vars
  handleSubmit: () => {},
  lastPage: () => {},
  form: { values: {} },
  campaignView: {},
  ...overrides
});

const wrapper = shallow(<PreviewCampaignForm {...mockProps()} />);

describe('(Component) PreviewCampaignForm', () => {
  it('renders without exploding', () => {
    expect(wrapper).to.have.lengthOf(1);
  });
});