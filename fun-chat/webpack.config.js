// Tutorial: https://www.youtube.com/watch?v=acAH2_YT6bs&t=448s
import path from 'path';
import { fileURLToPath } from 'url';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CopyPlugin from 'copy-webpack-plugin';

const devMode = process.env.NODE_ENV !== 'production';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default (env) => {
  const config = {
    mode: 'development', // "production is the default mode and webpack optimizes files for production. Delete this line to enter production or set it using --env when running in terminal",
    entry: path.resolve(__dirname, 'src/main.ts'),
    output: {
      path: path.resolve(__dirname, 'dist'), // Path for saving the final bundle file
      filename: '[name].[contenthash].bundle.js', //  Static file names have a PROBLEM. The browser chaches them and you that old version so your new changes might not work. You need a different name every time you change the built file Static file name - filename: "my-first-bundle.js", [name] uses the entry point name. [contenthash] solves the problem of caching by changing the name every time you change the file. If you run "build" again without changing files, the name will not be changed and the hash stays the same.
      clean: true, // Clean the output folder before starting the build to avoid unnecessary files from previous builds
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'src', 'index.html'),
        favicon: path.resolve(__dirname, 'src/assets', 'favicon.png'),
      }),
      //  html-webpack-plugin generates an HTML file for your application and automatically injects all your generated bundles into this file.
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash].bundle.css', // Output filename for extracted CSS
      }),
      new CopyPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, 'src/assets/files'),
            to: 'assets/audio',
          },
        ],
      }),
    ],
    devtool: 'eval-source-map', // helps to track the source code of the bundle.
    devServer: {
      static: {
        directory: path.resolve(__dirname, 'dist'),
      },
      port: env.port ?? 3001,
      open: true,
      hot: true,
      compress: true,
      historyApiFallback: true, // for Single Page Applications (SPAs). If you refresh on /about, the dev server would normally give a 404, because /about doesn’t exist as a real file. With historyApiFallback: true, webpack-dev-server instead serves your index.html, letting your client-side router handle the route.
    },
    module: {
      rules: [
        {
          test: /\.scss$/i,
          oneOf: [
            // If the file ends in .component.scss, import it as a string
            {
              test: /\.component\.scss$/i,
              use: ['to-string-loader', 'css-loader', 'sass-loader'],
            },
            // For all other scss (like base.scss), extract to a file
            {
              use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
            },
          ],
        },
        ,
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.html$/,
          use: 'html-loader',
        },
        {
          test: /\.(png|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
          generator: {
            filename:
              devMode === 'production_or_dev_decide_later'
                ? 'assets/images-icons/[name][ext]'
                : 'assets/images-icons/[name].[contenthash][ext]',
          },
          // About assets/resource https://webpack.js.org/guides/asset-modules/
        },
        {
          test: /\.svg$/i,
          type: 'asset/source', // extracts the code as 'string', doesn't treat it as 'image'
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
          generator: {
            filename:
              devMode === 'production_or_dev_decide_later'
                ? 'assets/fonts/[name][ext]'
                : 'assets/fonts/[name].[contenthash][ext]',
          },
        },
        {
          test: /\.(mp3|wav|ogg|m4a)$/i,
          type: 'asset/resource',
          generator: {
            filename:
              devMode === 'production_or_dev_decide_later'
                ? 'assets/audio/[name][ext]'
                : 'assets/audio/[name].[contenthash][ext]',
          },
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.js'],
    },
  };

  return config;
};
