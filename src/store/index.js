import Vue from 'vue'
import Vuex from 'vuex'
import user from './user'
import message from './message'
import { createStore } from 'vuex-extensions'

Vue.use(Vuex)

export default function (/* { ssrContext } */) {
  const Store = createStore(Vuex.Store, {
    state: {
    },
    getters: {
    },
    mutations: {
    },
    actions: {
    },
    modules: {
      user,
      message,
    },

    strict: process.env.DEBUGGING
  })

  return Store
}
