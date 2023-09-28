import Vue from 'vue';
import Vuex from 'vuex';
import contactos from './modules/contactos';
import user from './modules/user';

Vue.use(Vuex);

// const modulesFiles = require.context('./modules', true, /\.js$/);

// const modules = modulesFiles.keys().reduce((mods: ModuleTree<unknown>, modulePath) => {
//   const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1');
//   const value = modulesFiles(modulePath);
//   // eslint-disable-next-line no-param-reassign
//   mods[moduleName] = value.default;
//   return mods;
// }, {});

export default new Vuex.Store({
  modules: {
    contactos,
    user,
  },
});
