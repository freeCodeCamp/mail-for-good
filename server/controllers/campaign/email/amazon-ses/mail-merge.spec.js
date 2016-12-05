const { expect } = require('chai');

const mailMerge = require('./mail-merge');


describe('mailMerge', () => {
  let campaignInfo = { }
  let task = { email: 'someone@google.com' };

  it('does not modify the text if there are no template tags', () => {
    campaignInfo.emailBody = 'dear dude,\nthis is an email without template tags.\nxoxoxo';
    expect(mailMerge(task, campaignInfo)).to.be.equal(campaignInfo.emailBody);
  });

  it('it substitutes {{email}} with the recipient\'s email', () => {
    campaignInfo.emailBody = 'dear {{email}},\nthis is an email without template tags.\nxoxoxo';
    const expectedBody = 'dear someone@google.com,\nthis is an email without template tags.\nxoxoxo'

    expect(mailMerge(task, campaignInfo)).to.be.equal(expectedBody);
  });
});


