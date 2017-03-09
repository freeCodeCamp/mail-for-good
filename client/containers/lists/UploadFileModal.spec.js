import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import UploadFileModal from './UploadFileModal';

const mockProps = ( overrides) => ({ // eslint-disable-line no-unused-vars
  handleNewFile: () => {}
});

const wrapper = shallow(<UploadFileModal {...mockProps()} />);

describe('(Container) UploadFileModal', () => {
  it('renders without exploding', () => {
    expect(wrapper).to.have.lengthOf(1);
  });
});