const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");

module.exports = {
  entry: path.resolve(__dirname, 'website/script/index.ts'),
  mode: 'production',
  output: {
    filename: '[name].[fullhash].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Canvas',
      template: path.resolve(__dirname, 'website/template/index.html'),
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
    new FaviconsWebpackPlugin({
      logo: path.resolve(__dirname, 'website/favicons/favicon.png'), // Path to your favicon image
      cache: true, // Caches generated favicons to speed up subsequent builds
      inject: true, // Injects favicon links into the HTML
      favicons: {
        appName: 'Canvas RPG',
        appDescription: 'RPG Game App',
        developerName: 'Nick Kravchenko',
        developerURL: 'https://nick-kravchenko.github.io/canvas-rpg/', // Developer website
        background: '#ddd', // Background color of the favicon
        theme_color: '#333', // Theme color for mobile browsers
        icons: {
          android: false,
          chrome: false,
          favicons: true,
          appleIcon: true,
          appleStartup: false,
          windows: false,
        },
      },
    }),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'assets/images/[name].[ext]'
            }
          },
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: false,
                quality: 70
              }
            }
          },
        ],
      },
      {
        test: /\.(ogg|mp3|wav)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 9000,
  },
};
