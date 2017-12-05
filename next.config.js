module.exports = {
  webpack: (config) => {
    // Fixes npm packages that depend on `fs` module
    config.node = {
      fs: 'empty'
    }
    // config.module = {
    //   loaders: [{
    //     test: /\.jsx$/,
    //     loader: 'babel'
    //   }, {
    //     test: /\.css$/, // Only .css files
    //     loader: 'style!css' // Run both loaders
    //   }]
    // }

    return config
  }
}
