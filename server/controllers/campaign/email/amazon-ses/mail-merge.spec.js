const { expect } = require('chai');

const mailMerge = require('./mail-merge');


describe('mailMerge', () => {
  let campaignInfo = { }
  let task = { };

  it('does not modify the text if there are no template tags', () => {
    campaignInfo.emailBody = 'dear dude,\nthis is an email without template tags.\nxoxoxo';
    expect(mailMerge(task, campaignInfo)).to.be.equal(campaignInfo.emailBody);
  });
});


