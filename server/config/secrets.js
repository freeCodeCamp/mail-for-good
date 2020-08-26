module.exports = {
  sessionSecret: process.env.SESSION_SECRET || 'TestingTesting',
  mongo: process.env.MONGO_DB,

  email: {
    amazon: {
      accessKeyId: process.env.AMAZON_ACCESS_KEY_ID || null,
      secretAccessKey: process.env.AMAZON_SECRET_ACCESS_KEY || null
    }
  },
  
  smtpServer: {
    port: process.env.SMTP_TEST_PORT || '2025', // Linux envs disallow use of port <= 1024 without root
    host: process.env.SMTP_TEST_HOST || '127.0.0.1'
  },

  google: {
    consumerKey: process.env.GOOGLE_CONSUMER_KEY,
    consumerSecret: process.env.GOOGLE_CONSUMER_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK || 'http://localhost:8080/auth/google/callback'
  },
};
