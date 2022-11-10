<template>
  <q-toolbar>

    <q-btn stretch flat label="Online Dating App"  clickable to="search" />

    <q-space />

    <q-btn flat rounded icon="fa-brands fa-google" @click="loginInWithGoogle" v-if="!$store.state.user.isAuth">
      サインイン/ログイン
    </q-btn>

    <q-btn flat rounded v-else>
      <img round :src="$store.state.user.info.photoURL" alt="" class="w-40px rounded100">
      <span class="q-ml-sm q-mr-md">
        {{$store.state.user.info.displayName}}
      </span>
      <q-menu>
        <q-list style="min-width: 200px">
          <q-item v-close-popup>
            <q-item-section>MENU</q-item-section>
          </q-item>
          <q-separator />
          <q-item clickable to="search">
            <q-item-section avatar>
              <q-icon name="fa-solid fa-magnifying-glass" />
            </q-item-section>
            <q-item-section>
              ユーザーを探す
            </q-item-section>
          </q-item>
          <q-item clickable to="message">
            <q-item-section avatar>
              <q-icon name="fa-solid fa-comments" />
            </q-item-section>
            <q-item-section>
              メッセージ
            </q-item-section>
          </q-item>
          <q-item clickable to="edit-profile">
            <q-item-section avatar>
              <q-icon name="fa-solid fa-gears" />
            </q-item-section>
            <q-item-section>
              設定
            </q-item-section>
          </q-item>
          <q-item clickable @click="logout">
            <q-item-section avatar>
              <q-icon name="fa-solid fa-right-from-bracket" />
            </q-item-section>
            <q-item-section>
              <q-item-label>ログアウト</q-item-label>
            </q-item-section>
          </q-item>
          <q-separator />
          <EssentialLink v-for="link in essentialLinks" :key="link.title" v-bind="link" />
        </q-list>
      </q-menu>
    </q-btn>

  </q-toolbar>
</template>

<script>
  import EssentialLink from './EssentialLink';
  import { signInWithPopup, signOut } from 'firebase/auth';
  import { collection, addDoc, query, where, getDocs, getDoc, doc } from "firebase/firestore";
  import { auth, db, provider } from '../firebase';
  import { mapActions, mapGetters } from 'vuex';

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
    name: 'MenuBar',

    components: {
      EssentialLink
    },

    data() {
      return {
        essentialLinks: linksData
      }
    },

    methods: {
      ...mapActions('user', ['setIsAuth', 'setLoginUser', 'reset']),
      loginInWithGoogle() {
        signInWithPopup(auth, provider).then((result) => {
          this.setIsAuth(true);
          this.searchUser(result);
        });
      },
      async searchUser(res) {
        const q = query(collection(db, "users"), where("uid", "==", res.user.uid));
        const snap = await getDocs(q);

        if (snap.docs.length === 0) {
          this.setLoginUser(res.user);
          this.$router.push('edit-profile');
          this.setDB(res);
        } else {
          this.setLoginUser(snap.docs[0].data());
          this.$router.push('search');
        }
      },
      async setDB(res) {
        await addDoc(collection(db, "users"), {
          displayName: res.user.displayName,
          photoURL: "img/sample-image.jpeg",
          uid: res.user.uid,
          birthDay: "",
        });
      },
      logout() {
        if (confirm("ログアウトしますか？")) {
          signOut(auth).then(() => {
            localStorage.clear();
            this.reset();
          });
          this.$router.push('/');
        }
      },
      holdProfAtReload() {
        const userInfoString = JSON.stringify(this.getUserInfo);
        const isAuthString = JSON.stringify(this.getIsAuth);
        localStorage.setItem("isAuth", isAuthString);
        localStorage.setItem("userInfo", userInfoString);
      },
    },

    computed: {
      ...mapGetters('user', ['getUserInfo', 'getIsAuth']),
    },

    created() {
      // ログインユーザー情報が保存されている時は内容をストアで受け取る
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const isAuth = JSON.parse(localStorage.getItem("isAuth"));
      if (isAuth) {
        this.setIsAuth(isAuth);
        this.setLoginUser(userInfo);
      }
      // 更新する直前でログイン状況とログインユーザーの情報を保存する
      window.addEventListener("beforeunload", this.holdProfAtReload);
    },

    mounted() {
      localStorage.clear();
    },
  }
</script>

<style lang="scss" scoped>
</style>
