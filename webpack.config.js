'use strict';

module.exports = {
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /typings|node_modules/,
      loader: 'babel',
      query: {
        presets: ['react', 'es2015'],
      },
    }]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
};
