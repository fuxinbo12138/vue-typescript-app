import Vue from "vue";
import Vuex from "vuex";
import User from "./modules/user";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  getters: {
    user(state: any) {
      return state.User.user;
    }
  },
  mutations: {},
  actions: {},
  modules: {
    User
  }
});
