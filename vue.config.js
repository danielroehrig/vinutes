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
          target: ['AppImage'],
          icon: 'public/icons/icon.icns',
          category: 'Video',
          synopsis: 'Video diary made easy',
          desktop: {
            Name: 'Vinutes'
          },
          extraResources: [
            'bin/amd64/**'
          ]
        },
        win: {
          target: ['msi'],
          icon: 'public/icons/icon.ico',
          extraResources: [
            'bin/win64/**'
          ]
        },
        mac: {
          target: ['dmg'],
          icon: 'public/icons/icon.icns',
          category: 'public.app-category.entertainment',
          extraResources: [
            'bin/macos/**'
          ]
        },
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
