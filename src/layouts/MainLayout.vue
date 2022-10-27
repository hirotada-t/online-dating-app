<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>

        <q-toolbar-title>
          Online Dating App
        </q-toolbar-title>

        <q-btn flat dense rounded icon="fa-brands fa-google" @click="loginInWithGoogle" v-if="$store.state.isAuth">
          サインイン/ログイン</q-btn>
        <q-btn flat dense rounded @click="logout" v-else>
          <img src="" alt="">
          name
        </q-btn>
        <q-btn flat dense round icon="menu" @click="right = !right" />

      </q-toolbar>
    </q-header>

    <q-drawer v-model="right" side="right" overlay behavior="mobile" elavated>
      <ul>
        <li v-for="user of visibleUsers" :key="user.id">
          {{user.id}} / {{user.name}} / {{user.isVisible}}
        </li>
        <li>{{getTestUserById}}</li>
      </ul>
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
  import { mapActions, mapGetters } from 'vuex'

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
        right: false,
        essentialLinks: linksData
      }
    },
    methods: {
      ...mapActions(['increment', 'setIsAuth']),
      loginInWithGoogle() {
        signInWithPopup(auth, provider).then((result) => {
          console.log(result)
          localStorage.setItem("isAuth", this.$store.state.isAuth)
          this.setIsAuth();
          this.right = false;
          // 登録ページヘ遷移
        });
      },
      logout() {
        signOut(auth).then(() => {
          localStorage.clear()
          this.setIsAuth();
          this.right = false;
        })
      },
      add() {
        this.increment({ value: 10 });
      },
    },
    computed: {
      ...mapGetters(['visibleUsers', 'getUserById']),
      // getTestUsers() {
      //   return this.$store.getters.visibleUsers;
      // },
      getTestUserById() {
        return this.getUserById(1);
      }
    }
  }
</script>
