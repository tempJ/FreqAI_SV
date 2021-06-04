const path = require('path');

module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      externals: ['ffi-napi', 'ref-napi'],
      builderOptions: {
        extraResources: {
          from: 'public/',
          to: './'
        }
      }
    }
  }
}
