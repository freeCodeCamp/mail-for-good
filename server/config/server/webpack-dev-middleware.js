const webpack = require('webpack');
const history = require('connect-history-api-fallback');

/*
  With thanks to https://github.com/coryhouse/react-slingshot
  This app was kickstarted with this generator.
*/

module.exports = app => {
  if (process.env.NODE_ENV === 'development') {
    const webpackDevMiddleware = require('webpack-dev-middleware');
    const webpackHotMiddleware = require('webpack-hot-middleware');

    const devWebpackConfig = require('../../../webpack.config.dev');
    const compiler = webpack(devWebpackConfig);

    app.use(history());
    app.use(webpackDevMiddleware(compiler, {
      publicPath: devWebpackConfig.output.publicPath,
      noInfo: false,
      quiet: false,
      stats: {
        assets: false,
        colors: true,
        version: false,
        hash: false,
        timings: false,
        chunks: false,
        chunkModules: false
      },
    }));
    app.use(webpackHotMiddleware(compiler));
  }
};
