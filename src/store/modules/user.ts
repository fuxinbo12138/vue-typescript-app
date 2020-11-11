export default {
  namespaced: true,
  state: {
    user: JSON.parse(window.localStorage.getItem("user") || "null")
  },
  mutations: {
    setUser(state: any, payload: string) {
      state.user = JSON.parse(payload);
      window.localStorage.setItem("user", payload);
    }
  },
  actions: {}
};
