module.exports = {
    sessionSecret: process.env.SESSION_SECRET || 'TestingTesting',
    mongo: process.env.MONGO_DB,

    google: {
        consumerKey: process.env.GOOGLE_CONSUMER_KEY,
        consumerSecret: process.env.GOOGLE_CONSUMER_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK || '/auth/google/callback'
    }
};
