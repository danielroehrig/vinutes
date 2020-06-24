const webpack = require("webpack");

module.exports = {
    configureWebpack: {
    },
    pluginOptions: {
        electronBuilder: {
            preload: 'src/preload.js',
            chainWebpackMainProcess: config => {
                config.plugin('define').tap(args => {
                    args[0]['process.env.FLUENTFFMPEG_COV'] = false;
                    return args;
                })
            },
            builderOptions:{
                extraResources: ['public/**'],
            }
        }
    },
}