const state = {
  isAuth: false,
  info: {
    displayName: "",
    photoURL: "",
    email: "",
    birth: null,
    gender: "",
    preferredType: "",
    hobby: "",
    comment: "",
  },
  userList: {
    registered: [],
    sample: [],
  },
}

const mutations = {
  setLoginUser(state, user) {
    state.info.displayName = user.displayName;
    state.info.photoURL = "img/sample-image.jpeg";
    state.info.email = user.email;
    state.info.birth = user.birth;
    state.info.gender = user.gender;
    state.info.preferredType = user.preferredType;
    state.info.hobby = user.hobby;
    state.info.comment = user.comment;
  },
  setIsAuth(state, user) {
    state.isAuth = user;
  },
  setRegistered(state, user) {
    state.userList.registered = user;
  },
  setSample(state, user) {
    state.userList.sample = user;
  },
  reset(state) {
    state.isAuth = false;
    state.info = {}
    state.userList.registered = [];
    state.userList.sample = [];
  }
}

const getters = {
  getIsAuth: state => state.isAuth,
  getUserInfo: state => state.info,
  getUserList: state => state.userList,
}

const actions = {
  setLoginUser({ commit }, user) {
    commit('setLoginUser', user);
  },
  setIsAuth({ commit }, user) {
    commit('setIsAuth', user);
  },
  setRegistered({ commit }, user) {
    commit('setRegistered', user);
  },
  setSample({ commit }, user) {
    commit('setSample', user);
  },
  reset({ commit }) {
    commit('reset');
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
}
