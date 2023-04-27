const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const MergeJsonWebpackPlugin = require('merge-jsons-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, argv) => {
  const browser = env.BROWSER ?? 'chrome';
  return {
    entry: { background: './src/background/index.ts', content: './src/content/index.ts', options: './src/options/options.ts' },
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
    experiments: {
      topLevelAwait: true
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: 'options.html',
        template: './src/options/options.html',
        chunks: [],
        minify: argv.mode === 'production'
      }),
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
