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
 * @param {number} id - List subscriber id pointing to the person we're emailing
 * @param {object} campaignInfo - Information about this campaign
 * @return {object} amazonEmail - an email configured to be sent via Amazon's SES SDK (apiVersion: 2010-12-01)
 * @example return object:
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

module.exports = async function (id, campaignInfo, whiteLabelUrl) {
  const configuredCampaignInfo = Object.assign({}, campaignInfo); // Shallow copy of campaignInfo
  /**
   * @description Get the list subscriber and join their campaign subscriber information.
   */
  // Get the listsubscriber & join campaignsubscriber
  const subscriberInstance = await db.listsubscriber.findById(id, {
    include: [
      {
        model: db.campaignsubscriber,
        required: true
      }
    ],
  });
  const subscriber = subscriberInstance.get(); // Convery from {Instance} to plain {object}

  /**
   * @description Save a new CampaignAnalyticsLink and CampaignAnalyticsOpen for this subscriber
   */
  const campaignAnalyticsLinkRow = {
    trackingId: campaignInfo.trackingId,
    campaignanalyticId: campaignInfo.campaignAnalyticsId,
    listsubscriberId: subscriber.id
  };
  const link = await CampaignAnalyticsLink.create(campaignAnalyticsLinkRow, { raw: true });

  const campaignAnalyticsOpenRow = {
    campaignanalyticId: campaignInfo.campaignAnalyticsId,
    listsubscriberId: link.id
  };
  const open = await CampaignAnalyticsOpen.create(campaignAnalyticsOpenRow, { raw: true });

  /**
   * @description Configure the email body based on options enabled for this campaign send.
   */
  // If this campaign has enabled the unsubscribe link, inject it into configuredCampaignInfo
  if (campaignInfo.unsubscribeLinkEnabled) {
    configuredCampaignInfo.emailBody = insertUnsubscribeLink(campaignInfo.emailBody, subscriber.unsubscribeKey, campaignInfo.type, whiteLabelUrl);
  }
  // Replace any {{variables}} with data from campaignInfo
  configuredCampaignInfo.emailBody = mailMerge(subscriber, configuredCampaignInfo);
  // If this campaign has enabled tracking links, wrap the links
  if (campaignInfo.trackLinksEnabled) {
    configuredCampaignInfo.emailBody = wrapLink(campaignInfo.emailBody, link.trackingId, campaignInfo.type, whiteLabelUrl);
  }
  // If this campaign has enabled the tracking pixel, insert it into the email bdoy
  if (campaignInfo.trackingPixelEnabled) {
    configuredCampaignInfo.emailBody = insertTrackingPixel(campaignInfo.emailBody, open.trackingId, campaignInfo.type, whiteLabelUrl);
  }

  /**
   * @description At this stage we've configued the campaignInfo for this email. Now we'll
   *  return the configured email specific to Amazon's SES. This is ready to send using SES.
   */
  const amazonEmail = AmazonEmail(subscriber, configuredCampaignInfo);
  return amazonEmail;
};
