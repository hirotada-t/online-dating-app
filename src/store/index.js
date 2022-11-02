import Vue from 'vue'
import Vuex from 'vuex'
import user from './user'
import message from './message'
import { createStore } from 'vuex-extensions'

// import example from './module-example'

Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default function (/* { ssrContext } */) {
  const Store = createStore(Vuex.Store, {
    state: { //初期値
      count: 1,
      testUsers: [
        { id: 1, name: "大谷", isVisible: true },
        { id: 2, name: "村上", isVisible: false },
        { id: 3, name: "ダルビッシュ", isVisible: true },
      ]
    },
    getters: {
      // visibleUsers(state){
      //   return state.testUsers.filter(user => user.isVisible)
      // }
      visibleUsers: state => state.testUsers.filter(user => user.isVisible),
      getUserById: state => id => {
        return state.testUsers.find(user => user.id === id)
      },
    },
    mutations: {
      increment(state, payload) {
        state.count += payload.value
      },
    },
    actions: {
      increment({ commit }, peyload) {
        commit('increment', peyload);
      }
    },
    modules: {
      user,
      message,
    },

    strict: process.env.DEBUGGING
  })

  return Store
}
