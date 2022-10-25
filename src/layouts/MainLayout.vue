<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="leftDrawerOpen = !leftDrawerOpen" />

        <q-toolbar-title>
          Online Dating App
        </q-toolbar-title>

      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered content-class="bg-grey-1">
      <q-list>
        <q-item-label header class="text-grey-8">
          MENU
        </q-item-label>
        {{$store.state.count}}
        <q-btn @click="add">count up</q-btn>

        <q-item v-if="$store.state.isAuth" clickable @click="loginInWithGoogle">
          <q-item-section avatar>
            <q-icon name="fa-brands fa-google" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Googleでログイン</q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-else clickable @click="logout">
          <q-item-section avatar>
            <q-icon name="fa-brands fa-google" />
          </q-item-section>
          <q-item-section>
            <q-item-label>ログアウト</q-item-label>
          </q-item-section>
        </q-item>

        <EssentialLink v-for="link in essentialLinks" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
  import EssentialLink from 'components/EssentialLink.vue'
  import { signInWithPopup, signOut } from 'firebase/auth'
  import { auth, provider } from '../firebase'

  const linksData = [
    {
      title: 'Docs',
      caption: 'quasar.dev',
      icon: 'school',
      link: 'https://quasar.dev'
    },
    {
      title: 'Quasar Awesome',
      caption: 'Community Quasar projects',
      icon: 'favorite',
      link: 'https://awesome.quasar.dev'
    }
  ];

  export default {
    name: 'MainLayout',
    components: {
      EssentialLink
    },
    data() {
      return {
        leftDrawerOpen: false,
        essentialLinks: linksData
      }
    },
    methods: {
      loginInWithGoogle() {
        signInWithPopup(auth, provider).then((result) => {
        localStorage.setItem("isAuth", this.$store.state.isAuth)
          this.$store.commit('setIsAuth');
        });
      },
      logout() {
        signOut(auth).then(() => {
          localStorage.clear()
          this.$store.commit('setIsAuth');
        })
      },
      add() {
        this.$store.commit('increment',{value : 10});
      },
    }
  }
</script>
