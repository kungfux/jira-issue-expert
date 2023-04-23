const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const MergeJsonWebpackPlugin = require('merge-jsons-webpack-plugin');

module.exports = (env) => {
  const browser = env.BROWSER ?? 'chrome';
  return {
    entry: { background: './src/background/index.ts', content: './src/content/index.ts' },
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, `dist/${browser}`),
      clean: true,
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    plugins: [
      new CopyPlugin({
        patterns: [
          { from: './src/icons', to: 'icons' },
        ],
      }),
      new MergeJsonWebpackPlugin({
        space: 2,
        files: [
          './src/manifest.json',
          `./src/manifest.${env.BROWSER ?? 'chrome'}.json`,
        ],
        output: {
          fileName: 'manifest.json',
        },
      }),
    ],
  };
};
