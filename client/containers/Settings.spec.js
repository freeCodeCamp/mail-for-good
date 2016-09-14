import React from 'react';
import { shallow, mount } from 'enzyme';
import { expect } from 'chai';
import Settings from './Settings';
import nock from 'nock';
import jsdom from 'jsdom'
import { BASE_URL, SETTINGS_URL_RELATIVE } from '../constants/endpoints';


const doc = jsdom.jsdom('<!doctype html><html><body></body></html>')
global.document = doc
global.window = doc.defaultView

describe('<Settings />', () => {
  afterEach(() => {
    nock.cleanAll()
  })

  it('should contain the relevant SES settings inputs', () => {
    const wrapper = shallow(<Settings />);

    expect(wrapper.find('input[name="amazonSimpleEmailServiceAccessKey"]').prop('type')).to.equal('text');
    expect(wrapper.find('input[name="amazonSimpleEmailServiceSecretKey"]').prop('type')).to.equal('text');
  })

  it('on submit click, should send a request to the endpoint with the settings data', () => {
    // need to mount so that we can send change events to the <input>s
    const wrapper = mount(<Settings />);

    wrapper.find('input[name="amazonSimpleEmailServiceSecretKey"]').simulate(
      'change',
      {target: {name: 'accessKey', value: 'new_access_key'}}
    );
    wrapper.find('input[name="amazonSimpleEmailServiceSecretKey"]').simulate(
      'change',
      {target: {name: 'secretKey', value: 'new_secret_key'}}
    );

    let request = nock(BASE_URL)
      .log(console.log)
      .post(SETTINGS_URL_RELATIVE, {
        accessKey: 'new_access_key',
        secretKey: 'new_secret_key'
      })
      .reply(200)

    // bit of a hack to prevent a TypeError during testing, since we call e.preventDefault on the onClick handler
    wrapper.find('button').simulate('click', { preventDefault() {} });
    
    request.done();
  })
});
