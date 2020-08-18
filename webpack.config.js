// jshint esversion: 6
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin')

var extend = function () {
  var extended = {};

  for (const key in arguments) {
    var argument = arguments[key];
    for (const prop in argument) {
      if (Object.prototype.hasOwnProperty.call(argument, prop)) {
        extended[prop] = argument[prop];
      }
    }
  }

  return extended;
};

const common = {
  entry: './src/index.ts',
  externals: {
    jquery: 'jQuery'
  },
  module: {
    rules: [{
      test: /\.ts$/,
      use: 'ts-loader',
      exclude: /node_modules/
    }]
  },
  resolve: {
    extensions: ['.ts', 'js']
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'jautocalc.js'
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/typings.d.ts', to: 'typings.d.ts' }
      ]
    })
  ]
};

const dev = {
  devtool: 'source-map',
  mode: 'development'
};

const prod = {
  mode: 'production',
  output: {
    filename: 'jautocalc.min.js'
  }
}

module.exports = [extend(common, dev), extend(common, prod)];
