module.exports = {
  css: {
    loaderOptions: {
      scss: {
        prependData: '@import "@/scss/_variables.scss";',
      },
    },
  },
  chainWebpack: (config) => {
    config
      .plugin('html')
      .tap((args) => {
        // eslint-disable-next-line no-param-reassign
        args[0].title = 'Concord';
        return args;
      });
  },
  devServer: {
    disableHostCheck: true,
  },
  publicPath: './', /// ~ic024/entregas/iteracao3/E3-2/',
};
