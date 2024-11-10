import path from 'node:path';
import { fileURLToPath } from 'node:url';
import NodemonPlugin from 'nodemon-webpack-plugin';
import webpack from 'webpack';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const __src = path.resolve(__dirname, 'src');
const __distDev = path.resolve(__dirname, 'dist');
const __dist = path.resolve(__dirname, '..', 'dist');

const configBuilder = (env, argv) => {
  const config = {
    entry: __src + '/app.js',
    target: 'node',
    output: {
      filename: 'server.cjs',
      path: argv.mode === 'production' ? __dist : __distDev,
    },
    resolve: {
      alias: {},
    },
    module: {
      rules: [
        {
          test: /\.json$/i,
          type: 'asset/resource',
        },
      ],
    },
    plugins: [
      new NodemonPlugin({
        script: (argv.mode === 'development') ? __src + '/app.js' : __dist + '/server.cjs',
        watch: path.resolve('./src'),
        ext: 'js,njk,json,cjs',
        delay: '1000',
        nodeArgs: ['--inspect=9222'],
        verbose: true,
        env: {
          NODE_ENV: argv.mode,
        },
      }),
      new webpack.DefinePlugin({}),
    ],
  };

  if (argv.mode === 'development') {
    config.watch = true;
  }

  return config;
};

export default configBuilder;