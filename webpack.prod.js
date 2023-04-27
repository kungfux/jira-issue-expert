const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = (env) => {
  const argv = {
    mode: 'production',
  };
  return merge(common(env, argv), {
    ...argv
  });
};
