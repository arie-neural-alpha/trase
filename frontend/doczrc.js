// eslint-disable-next-line
import merge from 'webpack-merge';
import webpackConfig from './config/webpack.config';

export default {
  dest: './docs/dist',
  title: 'Trase',
  themeConfig: {
    colors: {
      primary: '#34444C',
      sidebarBg: '#fff0c2'
    }
  },
  modifyBundlerConfig: config =>
    merge(config, {
      resolve: webpackConfig.resolve,
      module: webpackConfig.module
    }),
  plugins: [],
  codeSandbox: false
};