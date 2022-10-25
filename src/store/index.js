import Vue from 'vue'
import Vuex from 'vuex'

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
  const Store = new Vuex.Store({
    state: { //初期値
      count: 1,
      isAuth:false,
    },
    mutations: {
      increment(state, payload) {
        state.count+= payload.value
      },
      setIsAuth(state) {
        state.isAuth = !state.isAuth
      }
    },
    actions: {
    },
    getters: {
    },
    modules: {
    },

    strict: process.env.DEBUGGING
  })

  return Store
}
