const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    devServer: (devServerConfig, { env, paths, proxy, allowedHost }) => {
        devServerConfig.devMiddleware.writeToDisk = true;
        return devServerConfig;
    },
    webpack: {
        configure: (webpackConfig, { env, paths }) => {
            if (env !== 'production') {
                webpackConfig.plugins.push(new CleanWebpackPlugin());
                return webpackConfig;
            }

            paths.appBuild = webpackConfig.output.path = path.resolve(__dirname, '..', 'dist/client');
            return webpackConfig;
        }
    }
};