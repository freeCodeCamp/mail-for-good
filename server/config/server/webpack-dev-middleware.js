const webpack = require('webpack');

module.exports = app => {
  if (process.env.NODE_ENV === 'development') {
    const webpackDevMiddleware = require('webpack-dev-middleware');
    const webpackHotMiddleware = require('webpack-hot-middleware');

    const devWebpackConfig = require('../../../webpack.config.dev');
    const compiler = webpack(devWebpackConfig);

    app.use(webpackDevMiddleware(compiler, { publicPath: devWebpackConfig.output.publicPath }));
    app.use(webpackHotMiddleware(compiler));
  }
};
