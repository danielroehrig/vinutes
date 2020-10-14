const webpack = require('webpack')

module.exports = {
  configureWebpack: {
  },
  pluginOptions: {
    electronBuilder: {
      externals: [
        'better-sqlite3'
      ],
      preload: 'src/preload.js',
      chainWebpackMainProcess: config => {
        config.plugin('define').tap(args => {
          args[0]['process.env.FLUENTFFMPEG_COV'] = false
          return args
        })
      },
      builderOptions: {
        linux: {
          target: ['AppImage', 'deb']
        },
        extraResources: [
          'public/**'
        ],
        asarUnpack: [
          '**/node_modules/sharp/**/*'
        ]
      }
    },
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: true
    }
  }
}
