import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import { ImportCSVComponent } from './ImportCSV';

const mockProps = ( overrides) => ({ // eslint-disable-line no-unused-vars
  handleCSVSubmit: () => {},
  isPosting: true,
  notification: () => {},
  upload: {}
});

const wrapper = shallow(<ImportCSVComponent {...mockProps()} />);

describe('(Container) ImportCSV', () => {
  it('renders without exploding', () => {
    expect(wrapper).to.have.lengthOf(1);
  });
});