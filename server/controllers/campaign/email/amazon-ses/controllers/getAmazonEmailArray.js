const db = require('../../../../../models');

const CampaignAnalyticsLink = require('../../../../../models').campaignanalyticslink;
const CampaignAnalyticsOpen = require('../../../../../models').campaignanalyticsopen;

const wrapLink = require('../lib/analytics').wrapLink;
const insertUnsubscribeLink = require('../lib/analytics').insertUnsubscribeLink;
const insertTrackingPixel = require('../lib/analytics').insertTrackingPixel;
const mailMerge = require('../lib/mail-merge');
const AmazonEmail = require('../lib/amazon');

/**
 * @description Get a formatted amazonEmail
 * @param {array} arrayOfIds - Array of list subscriber ids pointing to the person we're emailing
 * @param {object} campaignInfo - Information about this campaign
 * @return {array} array of amazonEmail - an email configured to be sent via Amazon's SES SDK (apiVersion: 2010-12-01)
 * @example return object in array:
 *  { email:
 *   { Source: '"John Doe" <example@email.com>',
 *     Destination: { ToAddresses: [Object] },
 *     Message: { Body: [Object], Subject: [Object] } },
 *  task:
 *   { id: 1082649,
 *     email: 'oto@dewut.org',
 *     subscribed: true,
 *     unsubscribeKey: 'cd8b16c0-70c7-4850-a00c-20737ce0837f',
 *     mostRecentStatus: 'unconfirmed',
 *     additionalData: { email: 'example@domain.org' },
 *     createdAt: 2017-03-04T21:30:16.323Z,
 *     updatedAt: 2017-03-04T21:30:16.323Z,
 *     listId: 5,
 *     campaignsubscribers:
 *      [ [Object],
 *        [Object],
 *        [Object] ] } }
 */

module.exports = async function (arrayOfIds, campaignInfo, whiteLabelUrl) {
  const arrayCampaignInfo = arrayOfIds.map(() => Object.assign({}, campaignInfo));
  /**
   * @description Get the list subscriber and join their campaign subscriber information.
   */
  // Get the listsubscriber & join campaignsubscriber
  const subscribers = await db.listsubscriber.findAll({
    where: {
      id: {
        in: arrayOfIds
      },
      subscribed: true
    },
    include: [
      {
        model: db.campaignsubscriber,
        required: true,
        where: {
          campaignId: campaignInfo.campaignId
        }
      }
    ],
    raw: true
  });

  /**
   * @description Save a new CampaignAnalyticsLink and CampaignAnalyticsOpen for these subscribers
   *  At the end of this, we'll have links[array] and opens[array]
   */

  const arrayCampaignAnalyticsLinks = subscribers.map(subscriber => {
    return {
      trackingId: campaignInfo.trackingId,
      campaignanalyticId: campaignInfo.campaignAnalyticsId,
      listsubscriberId: subscriber.id,
    };
  });
  const caLinks = await CampaignAnalyticsLink.bulkCreate(arrayCampaignAnalyticsLinks);
  const links = caLinks.map(x => x.get());

  const arrayCampaignAnalyticsOpens = subscribers.map(subscriber => {
    return {
      campaignanalyticId: campaignInfo.campaignAnalyticsId,
      listsubscriberId: subscriber.id,
    };
  });

  const caOpens = await CampaignAnalyticsOpen.bulkCreate(arrayCampaignAnalyticsOpens);
  const opens = caOpens.map(x => x.get());

  /**
   * @description Configure the email body based on options enabled for this campaign send.
   */

  // Iterate through both links and opens - adding things where necessary
  const arrayAmazonEmails = [];
  for (let i = 0; i < arrayOfIds.length; i++) {
    // If this campaign has enabled the unsubscribe link, inject it into configuredCampaignInfo
    if (arrayCampaignInfo[i].unsubscribeLinkEnabled) {
      arrayCampaignInfo[i].emailBody = insertUnsubscribeLink(arrayCampaignInfo[i].emailBody, subscribers[i].unsubscribeKey, arrayCampaignInfo[i].type, whiteLabelUrl);
    }
    // Replace any {{variables}} with data from campaignInfo
    arrayCampaignInfo[i].emailBody = mailMerge(subscribers[i], arrayCampaignInfo[i]);
    // If this campaign has enabled tracking links, wrap the links
    if (arrayCampaignInfo[i].trackLinksEnabled) {
      arrayCampaignInfo[i].emailBody = wrapLink(arrayCampaignInfo[i].emailBody, links[i].trackingId, arrayCampaignInfo[i].type, whiteLabelUrl);
    }
    // If this campaign has enabled the tracking pixel, insert it into the email bdoy
    if (arrayCampaignInfo[i].trackingPixelEnabled) {
      arrayCampaignInfo[i].emailBody = insertTrackingPixel(arrayCampaignInfo[i].emailBody, opens[i].trackingId, arrayCampaignInfo[i].type, whiteLabelUrl);
    }
    arrayAmazonEmails.push(AmazonEmail(subscribers[i], arrayCampaignInfo[i]));
  }

  /**
   * @description At this stage we've configued the campaignInfo for this email. Now we'll
   *  return the configured email specific to Amazon's SES. This is ready to send using SES.
   */

  return arrayAmazonEmails;
};
