import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import { ImportCSV } from './ImportCSV';

const mockProps = (overrides) => ({
  handleCSVSubmit: () => {},
  isPosting: true,
  notification: () => {},
  upload: {}
});

const wrapper = shallow(<ImportCSV {...mockProps()} />);

describe('(Container) ImportCSV', () => {
  it('renders without exploding', () => {
    expect(wrapper).to.have.lengthOf(1);
  });
});