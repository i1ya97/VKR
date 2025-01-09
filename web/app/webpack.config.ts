import path from 'path';

import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ImageminPlugin from 'imagemin-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import SitemapPlugin from 'sitemap-webpack-plugin';
import webpack from 'webpack';

import { sitemap } from './src/shared/utils/sitemap';

const ASSET_PATH = process.env.ASSET_PATH || '/';

const publicPath = path.resolve(__dirname, './public');
const srcPath = path.resolve(__dirname, './src');
const buildPath = path.resolve(__dirname, './build');

const DOMAIN = !!process.env.DOMAIN ? `${process.env.DOMAIN}/` : 'http://localhost';

const IS_DEV = process.env.NODE_ENV === 'development';
const IS_PROD = process.env.NODE_ENV === 'production';

const clientConfig = {
  entry: {
    main: `${srcPath}/app/entry/index.tsx`,
  },

  output: {
    path: buildPath,
    publicPath: ASSET_PATH,
    filename: IS_PROD ? 'build/[name].[contenthash].bundle.js' : 'build/[name].bundle.js',
  },

  resolve: {
    fallback: {
      stream: require.resolve('stream-browserify'),
      buffer: require.resolve('buffer'),
      path: require.resolve('path-browserify'),
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      crypto: require.resolve('crypto-browserify'),
      timers: require.resolve('timers-browserify'),
      fs: require.resolve('browserify-fs'),
    },
    alias: {
      '@app': `${srcPath}/app`,
      '@pages': `${srcPath}/pages`,
      '@widgets': `${srcPath}/widgets`,
      '@features': `${srcPath}/features`,
      '@entities': `${srcPath}/entities`,
      '@shared': `${srcPath}/shared`,
      '@generated': `${srcPath}/shared/utils/generated-types.tsx`,
    },
    extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx', '.json'],
  },

  module: {
    rules: [
      {
        test: /bootstrap\.tsx$/,
        loader: 'bundle-loader',
        options: {
          lazy: true,
        },
      },

      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-typescript', ['@babel/preset-react', { runtime: 'automatic' }]],
          plugins: [IS_DEV && require.resolve('react-refresh/babel')].filter(Boolean),
        },
      },

      ...(IS_PROD
        ? [
            {
              test: /\.(c|sa|sc)ss$/i,
              use: [
                MiniCssExtractPlugin.loader,
                {
                  loader: 'css-loader',
                  options: {
                    importLoaders: 1,
                    esModule: true,
                    modules: {
                      mode: 'local',
                      namedExport: true,
                      exportLocalsConvention: 'camel-case-only',
                      localIdentName: '[name]__[local]--[hash:base64:5]',
                    },
                  },
                },
                'sass-loader',
              ],
            },
          ]
        : [
            {
              test: /\.(c|sa|sc)ss$/i,
              use: [
                'style-loader',
                {
                  loader: 'css-loader',
                  options: {
                    esModule: true,
                    modules: {
                      mode: 'local',
                      namedExport: true,
                      exportLocalsConvention: 'camel-case-only',
                      localIdentName: '[name]__[local]--[hash:base64:5]',
                    },
                  },
                },
                'sass-loader',
              ],
            },
          ]),

      {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      },

      {
        test: /\.(jpe?g|png|gif)$/i,
        type: 'asset/resource',
        generator: {
          filename: `assets/images/[hash][ext]`,
        },
      },

      {
        test: /\.(woff2?|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: `assets/fonts/[hash][ext]`,
        },
      },
    ],
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.DOMAIN': JSON.stringify(DOMAIN),
      ASSET_PATH: JSON.stringify(ASSET_PATH),
    }),

    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),

    new webpack.ProvidePlugin({
      process: 'process/browser.js',
    }),

    new CopyWebpackPlugin({
      patterns: [
        {
          from: `${publicPath}/favicon`,
          to: `${buildPath}/favicon`,
        },
        {
          from: `${publicPath}/env-config.js`,
        },
        {
          from: `${publicPath}/robots.txt`,
        },
      ],
    }),

    new HtmlWebpackPlugin({
      template: `${publicPath}/index.html`,
      filename: 'index.html',
    }),

    ...(IS_DEV ? [new CleanWebpackPlugin(), new ReactRefreshWebpackPlugin()] : []),

    ...(IS_PROD
      ? [
          new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css',
            chunkFilename: '[name].[contenthash].css',
          }),

          new ImageminPlugin({
            test: /\.(jpe?g|png|gif|svg)$/i,
          }),

          new SitemapPlugin({
            base: DOMAIN,
            paths: sitemap
              .filter((s) => !s.disableSitemap)
              .map((s) => ({
                path: s.path,
                lastmod: s.lastmod,
                priority: s.priority,
                changefreq: s.changefreq,
              })),
            options: {
              skipgzip: true,
            },
          }),
        ]
      : []),
  ],

  watchOptions: {
    ignored: ['node_modules', 'build'],
  },

  ...(IS_DEV
    ? {
        mode: 'development',
        devtool: 'eval-cheap-module-source-map',
        optimization: {
          usedExports: true,
        },
        devServer: {
          hot: true,
          open: ['/'],
          port: 17602,
          historyApiFallback: true,
          client: {
            overlay: {},
          },
          proxy: [
            {
              context: ['/api'],
              target: 'http://51.250.32.125:17601/',
              pathRewrite: { '^/api': '' },
            },
          ],
        },
      }
    : {}),
  ...(IS_PROD
    ? {
        mode: 'production',
        devtool: false,
        optimization: {
          usedExports: true,
          runtimeChunk: 'single',
        },
        performance: {
          hints: 'warning',
          maxEntrypointSize: 512000,
          maxAssetSize: 512000,
        },
      }
    : {}),
};

export default clientConfig;
