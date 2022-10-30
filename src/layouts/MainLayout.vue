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
              <q-item clickable v-close-popup>
                <q-item-section>
                  <router-link to="message">メッセージ</router-link>
                </q-item-section>
              </q-item>
              <q-item clickable>
                <q-item-section>
                  <router-link to="edit-profile">プロフィール設定</router-link>
                </q-item-section>
              </q-item>
              <q-item clickable v-close-popup>
                <q-item-section>History</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
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

        <q-item v-if="!$store.state.user.isAuth" clickable @click="loginInWithGoogle">
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
  import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
  import { auth, db, provider } from '../firebase'
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
      ...mapActions(['increment']),
      ...mapActions('user', ['setIsAuth', 'setLoginUser']),
      loginInWithGoogle() {
        signInWithPopup(auth, provider).then((result) => {
          // サインイン→ストレージに保存→（新規登録）→画面遷移
          console.log(result)
          this.setIsAuth(true);
          localStorage.setItem("isAuth", true);

          this.setLoginUser(result.user);
          const userInfoString = JSON.stringify(this.getUserInfo);
          localStorage.setItem("userInfo", userInfoString);
          this.right = false;
          if (this.existUser(result).empty) {
            this.setUserInfo(result);
            this.$router.push('edit-profile');
          } else {
            this.$router.push('users');
          }
          /*
          ①メールアドレスでDBを検索
          ②-1アドレスが登録されている場合
          ・store/userにログインユーザーの情報をコミット
          ②-2アドレスが未登録の場合
          ・firebaseにアカウント情報を登録
          ・登録ページヘ遷移
          ・グーグルアカウントから情報を抜き出し
          ・登録内容（ニックネーム/画像/生まれ/性別/好みのタイプ/趣味/コメント）を記入
          ・firebaseを更新
          ③ログイン完了画面へ遷移（リストページ）
          */
        });
      },
      logout() {
        signOut(auth).then(() => {
          localStorage.clear()
          this.setIsAuth(false);
          this.right = false;
        });
        this.$router.push('/');
      },
      async existUser(res) {
        const q = query(collection(db, "users"), where("email", "==", res.user.email));
        return await getDocs(q);
      },
      async setUserInfo(res) {
        // 新規ユーザーをDBに登録
        await addDoc(collection(db, "users"), {
          name: res.user.displayName,
          img: res.user.photoURL,
          email: res.user.email,
          birth: null,
          sex: "",
          preferredType: "",
          hobby: "",
          comment: "",
        })
      },
      add() {
        this.increment({ value: 10 });
      },
    },
    computed: {
      ...mapGetters(['visibleUsers', 'getUserById']),
      ...mapGetters('user', ['getUserInfo']),
      // getTestUsers() {
      //   return this.$store.getters.visibleUsers;
      // },
      getTestUserById() {
        return this.getUserById(1);
      }
    },
    created() {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      console.log(userInfo)
      this.setLoginUser(userInfo);
    }
  }
</script>
