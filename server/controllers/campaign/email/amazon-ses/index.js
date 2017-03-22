const getArrayOfEmailIds = require('./controllers/getArrayOfEmailIds');
const getAmazonEmail = require('./controllers/getAmazonEmail');
const updateCampaignStatus = require('./controllers/updateCampaignStatus');
const finishCampaignSend = require('./controllers/finishCampaignSend');

const configSes = require('./config/configSes');

const sendCampaignSuccessEmail = require('./utils/sendCampaignSuccessEmail');

const sendFinalNotification = require('./notifications/sendFinalNotification');
const sendUpdateEmailsSentNotification = require('./notifications/sendUpdateEmailsSentNotification');

const CreateQueue = require('./queue');
/**
 * @description Starts the process of sending emails
 */

module.exports = async function (generator, redis, campaignAndListInfo, amazonAccountInfo, io, req) {
  const {
    campaignInfo, // See object passed by send-campaign.js, contains info about the campaigns table
  } = campaignAndListInfo;

  const {
    accessKey, // Amazon access key - str
    secretKey, // Amazon secret key - str
    region, // Amazon region - str
    whiteLabelUrl, // URL of a service that serves this app - str
    quotas // Amazon limits - obj { AvailableToday, MaxSendRate }
  } = amazonAccountInfo;

  /**
   * @description Configure variables & do work prior to starting the email send.
   */

  const startTime = new Date();  // Track the start time so we can tell the user how long sending took
  const rateLimit = Number(process.env.DEV_SEND_RATE) || quotas.MaxSendRate; // No. of email we can send p/s as established by Amazon
  const ses = configSes(accessKey, secretKey, region);
  const addToQueue = CreateQueue(rateLimit, ses);
  const notificationSentEmails = sendUpdateEmailsSentNotification(campaignInfo, io, req);
  let cancelCampaignSend = false; // Flag that indicates whether or not a campaign should send
  await updateCampaignStatus(campaignInfo);

  redis.subscriber.on('message', (channel, campaignId) => {
    if (campaignId == campaignInfo.campaignId) {
      cancelCampaignSend = true;
    }
  });
  redis.subscriber.subscribe('stop-campaign-sending');

  /**
   * @description Start the campaign send.
   *  We will start by getting all ids of list subscribers that we'll email. We'll store this in memory.
   *  This lets us keep a small footprint on this front, while having certainty over who we will email.
   */
  // let countPerSecond = 0; (function timerFunc() { setTimeout(() => { console.log(countPerSecond); countPerSecond = 0; timerFunc(); }, 1000) })();
  // 1. Get plain array of listSubscriberIds e.g. [1, 2, 3] etc. These are the people we will email.
  const listSubscriberIds = await getArrayOfEmailIds(campaignInfo);
  // 2. Iterate over the ids, sending each in turn.
  const LENGTH_OF_LIST_SUBSCRIBER_IDS = listSubscriberIds.length;
  for (let i = 0; i < LENGTH_OF_LIST_SUBSCRIBER_IDS; i++) {
    if (cancelCampaignSend) {
      // Break out of loop if the user cancelled this campaign send
      break;
    }
    if (i % 200 === 0 || i == LENGTH_OF_LIST_SUBSCRIBER_IDS - 1) {
      // Send an update notification per 200 emails or if this is the last email
      notificationSentEmails();
    }
    const id = listSubscriberIds[i];
    // 1. Get the getAmazonEmail for this user.
    const amazonEmail = await getAmazonEmail(id, campaignInfo, whiteLabelUrl);
    // 2. Add the email to the send queue. Continue when the queue tells us that it has space for our next email.
    await addToQueue(amazonEmail, campaignInfo);
  }

  /**
   * @description The campaign has now been sent or cancelled. We can do some final work then continue the parent generator
   */

  redis.subscriber.unsubscribe('stop-campaign-sending');
  finishCampaignSend(cancelCampaignSend, campaignInfo); // Change the campaign status. Users cannot resend the campaign after this.
  sendCampaignSuccessEmail(campaignInfo, startTime, ses); // Send an email to the campaign owner notifying them that this finished.
  const outcome = cancelCampaignSend ? 'cancelled' : 'success';
  sendFinalNotification(outcome, campaignInfo, io, req);

  const didExperienceError = cancelCampaignSend ? 'cancelled' : null;
  generator.next(didExperienceError);
};
