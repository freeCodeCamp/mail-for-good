/*
  The purpose of this file is to produce emails (see general messaging vernacular). To produce means to
  place items in a queue. This file uses 'bull', which implements a lightweight, robust messaging/queue
  system backed by redis.
*/

// See ref - https://github.com/OptimalBits/bull#queue
const QUEUE_ADD_CONFIG = {
  attempts: 5, // How many attempts to attempt sending an email before calling it quits
  backoff: {
    type: 'exponential',
    delay: 5000 // ms
  },
  removeOnComplete: true // Whether or not to store completed jobs in Redis on completion
};

module.exports = function(Queue) {

  return {
    add: function add(job) {
      // @params emailFormat = A correctly formatted emailFormat object.
      Queue.add(job, QUEUE_ADD_CONFIG);
    }
  };
};
