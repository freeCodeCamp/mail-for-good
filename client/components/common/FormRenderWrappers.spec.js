import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import {
  renderSettingsDropdownList,
  renderDropdownList,
  renderCombobox,
  renderSettingsField,
  renderField,
  renderEditorTypeRadio,
  renderTextEditor
} from './FormRenderWrappers';

describe('(Component) renderSettingsDropdownList', () => {
  const wrapper = shallow(<renderSettingsDropdownList />);

  it('renders without exploding', () => {
    expect(wrapper).to.have.lengthOf(1);
  });
});

describe('(Component) renderDropdownList', () => {
  const wrapper = shallow(<renderDropdownList />);
  
  it('renders without exploding', () => {
    expect(wrapper).to.have.lengthOf(1);
  });
});

describe('(Component) renderCombobox', () => {
  const wrapper = shallow(<renderCombobox />);
  
  it('renders without exploding', () => {
    expect(wrapper).to.have.lengthOf(1);
  });
});

describe('(Component) renderSettingsField', () => {
  const wrapper = shallow(<renderSettingsField />);
  
  it('renders without exploding', () => {
    expect(wrapper).to.have.lengthOf(1);
  });
});

describe('(Component) renderField', () => {
  const wrapper = shallow(<renderField />);
  
  it('renders without exploding', () => {
    expect(wrapper).to.have.lengthOf(1);
  });
});

describe('(Component) renderEditorTypeRadio', () => {
  const wrapper = shallow(<renderEditorTypeRadio />);
  
  it('renders without exploding', () => {
    expect(wrapper).to.have.lengthOf(1);
  });
});

describe('(Component) renderTextEditor', () => {
  const wrapper = shallow(<renderTextEditor />);
  
  it('renders without exploding', () => {
    expect(wrapper).to.have.lengthOf(1);
  });
});