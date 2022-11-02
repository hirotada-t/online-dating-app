<template>
  <q-page class="flex flex-center column">
    <h2>UserList</h2>
    <div class="q-pa-md row flex-start">
      <div class="col-3 q-px-sm q-my-sm" v-for="user in userList.registered" :key="user.name">
        <q-card>
          <img :src="user.img">
          <q-card-section>
            <div class="text-h6">{{user.name}}</div>
            <div class="text-subtitle2">age: {{user.birth}}</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-3 q-px-sm q-my-sm" v-for="sample in userList.sample" :key="sample.id.value">
        <q-card>
          <img :src="sample.picture.large">
          <q-card-section>
            <div class="text-h6">{{sample.name.first}}(Sample)</div>
            <div class="text-subtitle2">age: {{sample.dob.age}}</div>
          </q-card-section>
        </q-card>
      </div>
    </div>

  </q-page>
</template>

<script>
  import { collection, query, where, getDocs } from 'firebase/firestore';
  import { db } from '../firebase';
  import { mapActions, mapGetters } from 'vuex';
  import { Loading, QSpinnerGears } from 'quasar';

  const api = {
    url: 'https://randomuser.me/api/?results=5',
    option: {
      method: 'get',
    }
  }
  export default {
    name: 'UserList',
    data() {
      return {
        userList: {},
      }
    },
    methods: {
      ...mapActions("user", ["setRegistered", "setSample"]),
      async getUser() {
        const loginUser = this.getUserInfo;
        const q = query(collection(db, "users"), where("email", "!=", loginUser.email));
        const queryUser = await getDocs(q);
        const arr = [];
        queryUser.forEach(doc => arr.push(doc.data()));

        let response = this.getUserList.sample;
        console.log(this.getUserList)
        if (response.length === 0) {
          response = await fetch(api.url, api.option).then(res => res.json());
        }

        this.setSample(response.results);
        this.setRegistered(arr);
      },
      holdUsersAtReload() {
        const userListString = JSON.stringify(this.getUserList);
        localStorage.setItem("userList", userListString);
      },
    },

    computed: {
      ...mapGetters("user", ["getUserInfo", "getUserList"]),
    },

    created() {
      this.$q.loading.show();
      const userList = JSON.parse(localStorage.getItem("userList"));
      const storeUserList = this.getUserList;
      if (userList != null) {
        // ユーザーリストが保存されている時は内容をストアで受け取る
        this.setRegistered(userList.registered);
        this.setSample(userList.sample);
      } else if (storeUserList.registered.length === 0 || storeUserList.sample.length === 0) {
        // ストアにユーザーリストが無い場合は読み込みを実行する
        this.getUser();
      }
      this.userList = this.getUserList;
      this.$q.loading.hide();
      console.log(this.userList)
      // 更新する直前でユーザーリストを保存する
      window.addEventListener("beforeunload", this.holdUsersAtReload);
    },
  }
  /*
  ToDo
  ・ページリスト（HOME/ユーザーリスト→プロフィール詳細/プロフィール編集/メッセージルーム）
  ・詳細ページへのリンク
  ・ユーザーIDを設定する（ドキュメントID）
  ・一覧ページで読み込む内容を減らす（メール・名前・画像・年齢）
  ・Editページ（detailオブジェクトにまとめる・IDで読み込み）
  ・プロフィールの内容をストアに保存
  */
</script>

<style lang="scss">
  .q-card {
    transition: all .3s;
    cursor: pointer;
    &:hover {
      transform: translate(3px, -5px);
    }
  }
</style>
