<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>

        <q-toolbar-title>
          Online Dating App
        </q-toolbar-title>

        <q-btn flat dense rounded icon="fa-brands fa-google" @click="loginInWithGoogle"
          v-if="!$store.state.user.isAuth">
          サインイン/ログイン
        </q-btn>

        <q-btn flat dense rounded v-else>
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
                <q-item-section>
                  ユーザーを探す
                </q-item-section>
              </q-item>
              <q-item clickable to="message">
                <q-item-section>
                  メッセージ
                </q-item-section>
              </q-item>
              <q-item clickable to="edit-profile">
                <q-item-section>
                  プロフィール設定
                </q-item-section>
              </q-item>
              <q-item clickable @click="logout">
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
    </q-header>
    <q-drawer show-if-above side="left">
      <!-- drawer content -->
    </q-drawer>

    <q-drawer show-if-above side="right">
      <!-- drawer content -->
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
  import EssentialLink from 'components/EssentialLink';
  import { signInWithPopup, signOut } from 'firebase/auth';
  import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
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
    name: 'MainLayout',

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
          // サインイン→ストレージに保存→（新規登録）→画面遷移
          console.log(result)
          this.setIsAuth(true);
          this.setLoginUser(result.user);

          this.searchUser(result);
        });
      },
      async searchUser(res) {
        const q = query(collection(db, "users"), where("uid", "==", res.user.uid));
        const snap = await getDocs(q);

        if (snap.docs.length === 0) {
          this.$router.push('edit-profile');
          this.setUserInfo(res);
        } else {
          this.$router.push('search');
        }
      },
      async setUserInfo(res) {
        // 新規ユーザーをDBに登録
        await addDoc(collection(db, "users"), {
          name: res.user.displayName,
          img: "img/sample-image.jpeg",
          uid: res.user.uid,
          birth: null,
          gender: "",
          preferredType: "",
          hobby: "",
          comment: "",
        })
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
