const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = (env) => {
  const argv = {
    mode: 'development',
    devtool: 'inline-source-map',
  };
  return merge(common(env, argv), {
    ...argv,
  });
};
