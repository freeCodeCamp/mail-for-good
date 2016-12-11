const { expect } = require('chai');
const exportSentUnsentCsv = require('./export-sent-unsent-csv');
const {
  sequelize,
  campaignanalytics: CampaignAnalytics,
  campaignsubscriber: CampaignSubscriber,
  campaign: Campaign,
  user: User,
  list: List,
  listsubscriber: ListSubscriber
} = require('../../models');

describe('exportSentUnsentCsv', () => {
  describe('normal cases', () => {
    let res = { };
    let user, list;
    beforeEach(done => {
      sequelize.sync({ force: true }).then(() => {
        User.create({}).then(createdUser => {
          user = createdUser;
          List.create({
            name: 'list1',
            userId: user.id
          }).then(createdList => {
            list = createdList;
            ListSubscriber.bulkCreate([
              { listId: list.id, email: 'someone@someone.com' },
              { listId: list.id, email: 'someone2@someone.com' },
              { listId: list.id, email: 'someone3@someone.com' }
            ]).then(() => {
              Campaign.create({ userId: user.id, listId: list.id }).then((campaign) => {
                CampaignSubscriber.bulkCreate([
                  { listId: list.id, email: 'someone@someone.com', campaignId: campaign.id },
                  { listId: list.id, email: 'someone2@someone.com', campaignId: campaign.id },
                  { listId: list.id, email: 'someone3@someone.com' , campaignId: campaign.id }
                ]).then(() => {
                  const request = {
                    user: { id: user.id },
                    query: { campaignId: campaign.id, sent: false }
                  }
                  let mockResponse = (callback) => {
                    return {
                      send: callback,
                      setHeader: () => { },
                      write: () => { },
                      once: () => { },
                      end: () => { }
                    }
                  };
                  exportSentUnsentCsv(request, mockResponse(function (data) {
                    res = data;
                    done();
                  }))
                })
              })
            })
          })
        })
      })
    })

    xit('responds with a csv', () => {
    });
  })
})
