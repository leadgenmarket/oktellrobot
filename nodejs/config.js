var config = {};

config.port = process.env.APP_PORT
config.dsn = process.env.APP_DSN
config.logLevel = process.env.APP_LOG_LEVEL
config.dashaApiKey = process.env.APP_DASHA_API_KEY
config.dashaServer = process.env.APP_DASHA_SERVER

module.exports = config;