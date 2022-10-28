const state = {
  isAuth:false,
  loginUserName: "",
  imgURL: "",
  email: "",
  birth: null,
  sex: "",
  preferredType: "",
  hobby: "",
  comment: "",
}

const mutations = {
  setLoginUser(state, user) {
    state.loginUserName = user.displayName;
    state.imgURL = user.photoURL;
    state.email = user.email;
    state.birth = user.birth;
    state.sex = user.sex;
    state.preferredType = user.preferredType;
    state.hobby = user.hobby;
    state.comment = user.comment;
  },
  setIsAuth(state, user) {
    state.isAuth = user;
  }
}

const getters = {
}

const actions = {
  setLoginUser({commit}, user) {
    commit('setLoginUser', user);
  },
  setIsAuth({commit},user) {
    commit('setIsAuth', user);
  }
}

export default {
  namespaced:true,
  state,
  mutations,
  getters,
  actions
}
