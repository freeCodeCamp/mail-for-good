const webpack =  require('webpack');
const HtmlWebpackPlugin =  require('html-webpack-plugin');
const autoprefixer =  require('autoprefixer');
const path = require('path');

module.exports = {
  resolve: {
    extensions: ['.js', '.jsx', '.css']
  },
  context: path.resolve(process.cwd(), 'client'),
  devtool: 'eval',
  entry: { app: ['./index', 'webpack-hot-middleware/client?reload=true'] },
  output: {
    path: `${__dirname}/client`, // Note: Physical files are only output by the production build task `npm run build`.
    publicPath: '/',
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'), // Tells React to build in either dev or prod modes. https://facebook.github.io/react/downloads.html (See bottom)
      __DEV__: true
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({     // Create HTML file that includes references to bundled CSS and JS.
      template: 'index.ejs',
      minify: {
        removeComments: true,
        collapseWhitespace: true
      },
      inject: true
    }),
    new webpack.ProvidePlugin({
      jQuery: 'jquery',
      $: 'jquery',
      jquery: 'jquery'
    })
  ],
  module: {
    loaders: [
      {test: /\.jsx?$/, exclude: /node_modules/, loaders: ['babel-loader']},
      {test: /\.eot(\?v=\d+.\d+.\d+)?$/, loader: 'file-loader'},
      {test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf)$/, loader: 'url-loader', options: { name: '[hash].[ext]', limit: 10000 }},
      {test: /\.ico$/, loader: 'file-loader', options: { name: '[hash].[ext]' }},
      {test: /(\.css|\.scss)$/, loaders: ['style-loader', 'css-loader',  'sass-loader']},
      {
        test: /\.json$/,
        include: /node_modules/,
        loader: 'json-loader'
      }
    ]
  },

};
