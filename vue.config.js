const webpack = require('webpack')
const path = require('path')

module.exports = {
  configureWebpack: {
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      // load which style file you want to import globally
      patterns: [path.resolve(__dirname, './sass/vinutes.scss')]
    },
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
          target: ['AppImage', 'pacman'],
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
          category: 'public.app-category.video',
          extraResources: [
            'bin/macos/**'
          ]
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
