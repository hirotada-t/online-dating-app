const state = {
  isAuth: false,
  info: {
    displayName: "",
    photoURL: "",
    uid: "",
    birthDay: "",
    gender: "",
    prof: {
      pr: "",
      preferredType: "",
      work: "",
      hobby: "",
      comment: "",
    }
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
    state.info.uid = user.uid;
    state.info.birthDay = user.birthDay;
    state.info.gender = user.gender;
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
    state.info = {
      displayName: "",
      photoURL: "",
      uid: "",
      birthDay: "",
      gender: "",
      prof: {
        pr: "",
        preferredType: "",
        work: "",
        hobby: "",
        comment: "",
      }
    };
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
