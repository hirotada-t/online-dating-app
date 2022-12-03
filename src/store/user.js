import { date } from 'quasar';

const state = {
  isAuth: false,
  info: {
    displayName: "",
    photoURL: "",
    uid: "",
    birthDay: "",
    gender: "",
    pr: "",
    preferredType: "",
    work: "",
    hobby: "",
    introduction: "",
  },
  userList: [],
}

const checkValue = (value) => {
  return typeof value === "undefined" ? "" : value;
}

const mutations = {
  setLoginUser(state, user) {
    state.info.displayName = checkValue(user.displayName);
    state.info.photoURL = checkValue(user.photoURL);
    state.info.uid = checkValue(user.uid);
    state.info.birthDay = checkValue(user.birthDay);
    state.info.gender = checkValue(user.gender);
    state.info.pr = checkValue(user.pr);
    state.info.preferredType = checkValue(user.preferredType);
    state.info.work = checkValue(user.work);
    state.info.hobby = checkValue(user.hobby);
    state.info.introduction = checkValue(user.introduction);
  },
  setIsAuth(state, user) {
    state.isAuth = user;
  },
  setUserList(state, user) {
    state.userList.push(user);
  },
  reset(state) {
    state.isAuth = false;
    state.info = {
      displayName: "",
      photoURL: "",
      uid: "",
      birthDay: "",
      gender: "",
      pr: "",
      preferredType: "",
      work: "",
      hobby: "",
      introduction: "",
    };
    state.userList = [];
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
  setUserList({ commit }, user) {
    commit('setUserList', user);
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
