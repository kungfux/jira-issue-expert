const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const ZipPlugin = require('zip-webpack-plugin');

module.exports = (env) => {
  const argv = {
    mode: 'production',
  };
  return merge(common(env, argv), {
    ...argv,
    plugins: [
      new ZipPlugin({
        filename: `jira-issue-expert-${env.BROWSER ?? 'chrome'}.zip`,
        include: [/\.json/, /\.js/, /\.html/, /icons/],
      }),
    ],
  });
};
