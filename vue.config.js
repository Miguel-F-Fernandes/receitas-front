module.exports = {
  transpileDependencies: ['vuetify'],
  chainWebpack: config => {
    config
      .plugin('html')
      .tap(args => {
        args[0].title = 'Coquetéis'
        return args
      })
  },
  configureWebpack:{
    optimization: {
      splitChunks: {
        minSize: 10000,
        maxSize: 250000,
      }
    }
  },
  pwa: {
    name: 'Coquetéis',
    workboxOptions: {
      skipWaiting: true
    }
  },
}
