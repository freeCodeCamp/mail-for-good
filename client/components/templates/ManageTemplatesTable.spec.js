import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import ManageTemplatesTable from './ManageTemplatesTable';

const mockProps = ( overrides) => ({ // eslint-disable-line no-unused-vars
  data: [],
  deleteRows: () => {},
  getTemplateView: () => {},
  ...overrides
});

const wrapper = shallow(<ManageTemplatesTable {...mockProps()} />);

describe('(Component) ManageTemplatesTable', () => {
  it('renders without exploding', () => {
    expect(wrapper).to.have.lengthOf(1);
  });
});