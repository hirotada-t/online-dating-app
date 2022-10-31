const state = {
  isAuth: localStorage.getItem("isAuth"),
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
  sample: [],
  sampleLoaded: false,
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
  setSampleUser(state, user) {
    state.sample = user;
  },
  setSampleLoaded(state) {
    state.sampleLoaded = true;
  }
}

const getters = {
  getUserInfo: state => state.info,
  getSampleLoaded: state => state.sampleLoaded,
}

const actions = {
  setLoginUser({ commit }, user) {
    commit('setLoginUser', user);
  },
  setIsAuth({ commit }, user) {
    commit('setIsAuth', user);
  },
  setSampleUser({commit}, user) {
    commit('setSampleUser', user);
  },
  setSampleLoaded({commit}) {
    commit('setSampleLoaded')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
}
