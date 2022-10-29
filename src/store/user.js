const state = {
  isAuth: localStorage.getItem("isAuth"),
  info: {
    displayName: "",
    photoURL: "",
    email: "",
    birth: null,
    sex: "",
    preferredType: "",
    hobby: "",
    comment: "",
  }
}

const mutations = {
  setLoginUser(state, user) {
    state.info.displayName = user.displayName;
    state.info.photoURL = user.photoURL;
    state.info.email = user.email;
    state.info.birth = user.birth;
    state.info.sex = user.sex;
    state.info.preferredType = user.preferredType;
    state.info.hobby = user.hobby;
    state.info.comment = user.comment;
  },
  setIsAuth(state, user) {
    state.isAuth = user;
  }
}

const getters = {
  getUserInfo: state => state.info,
}

const actions = {
  setLoginUser({ commit }, user) {
    commit('setLoginUser', user);
  },
  setIsAuth({ commit }, user) {
    commit('setIsAuth', user);
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
}
