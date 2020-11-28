module.exports = {
  publicPath: './',
  devServer: {
    port: 8082
  },
  css: {
    loaderOptions: {
      sass: {
        prependData: "@import '@/assets/scss/variate.scss';",
      },
    },
  },
}
