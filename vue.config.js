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
        appId: 'de.danielroehrig.vinutes',
        linux: {
          target: ['AppImage', 'deb', 'pacman', 'snap'],
          icon: 'assets/VinuteHeart-Pink.png',
          category: 'Video',
          synopsis: 'Video diary made easy',
          desktop: {
            Name: 'Vinutes',
            Icon: 'assets/VinuteHeart-Pink.png'
          }
        },
        win: {
          target: ['msi', 'nsis'],
          icon: 'assets/VinuteHeart-Pink.ico'
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
