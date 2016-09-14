module.exports = {
    sessionSecret: process.env.SESSION_SECRET || 'TestingTesting',
    mongo: process.env.MONGO_DB,

    // Secrets for testing purposes
    testEmail: process.env.EMAIL || null,

    email: {
      amazon: {
        accessKeyId: process.env.AMAZON_ACCESS_KEY_ID || null,
        secretAccessKey: process.env.AMAZON_SECRET_ACCESS_KEY || null
      }
    },
    //

    google: {
        consumerKey: process.env.GOOGLE_CONSUMER_KEY,
        consumerSecret: process.env.GOOGLE_CONSUMER_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK || '/auth/google/callback'
    }
};
