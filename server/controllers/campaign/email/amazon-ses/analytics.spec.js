const { expect } = require('chai');

const { insertTrackingPixel, insertUnsubscribeLink } = require('./analytics');


describe('amazon-ses analytics', () => {
  describe('insertUnsubscribeLink', () => {
    const body = '\ndear whoever,\nthis is a plaintext email body\ncheers.';
    const unsubscribeLink = 'd9ba38b2-7b52-449f-946c-7dfb7c97a3f3';

    it('inserts an unsubscribe link at the end of a html email', () => {
      const expectedBody = body + '\n<a href="http://localhost:8080/unsubscribe/d9ba38b2-7b52-449f-946c-7dfb7c97a3f3">unsubscribe</a>';

      expect(insertUnsubscribeLink(body, unsubscribeLink, 'Html')).to.be.equal(expectedBody);
    })
  })

  describe('insertTrackingPixel', () => {
    const body = '\ndear whoever,\nthis is a plaintext email body\ncheers.';
    const trackingId = 'd9ba38b2-7b52-449f-946c-7dfb7c97a3f3';

    it('does not add a tracking pixel to a plaintext email', () => {
      expect(insertTrackingPixel(body, trackingId, 'Plaintext')).to.equal(body);
    })

    it('adds a tracking pixel img tag to the end of a html email', () => {
      const expectedImgTag = '<img src="http://localhost:8080/trackopen?trackingId=d9ba38b2-7b52-449f-946c-7dfb7c97a3f3" style="position:absolute; visibility:hidden">'
      const expectedBody = body + '\n' +  expectedImgTag;

      expect(insertTrackingPixel(body, trackingId, 'Html')).to.be.equal(expectedBody);
    })
  })
})
