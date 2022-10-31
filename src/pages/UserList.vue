<template>
  <q-page class="flex flex-center column">
    <h2>UserList</h2>
    <div class="q-pa-md row flex-start">
      <div class="col-3 q-px-sm q-my-sm" v-for="user in userList" :key="user.name">
        <q-card>
          <img :src="user.img">
          <q-card-section>
            <div class="text-h6">{{user.name}}</div>
            <div class="text-subtitle2">age: {{user.birth}}</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-3 q-px-sm q-my-sm" v-for="sample in randomUser" :key="sample.id.value">
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
  import { mapGetters } from 'vuex';
  import { Loading, QSpinnerGears } from 'quasar';

  Loading.show();

  const apiURL = 'https://randomuser.me/api/?results=5';
  const apiOption = {
    method: 'get',
  }
  export default {
    name: 'UserList',
    data() {
      return {
        userList: [],
        randomUser: [],
      }
    },
    methods: {
      async getUser() {
        const loginUser = this.getUserInfo;
        const q = query(collection(db, "users"), where("email", "!=", loginUser.email));
        const queryUser = await getDocs(q);
        const arr = [];

        queryUser.forEach(doc => arr.push(doc.data()));
        const response = await fetch(apiURL, apiOption).then(res => res.json());

        this.userList = arr;
        this.randomUser = response.results;

        this.$q.loading.hide();
      },
    },

    computed: {
      ...mapGetters("user", ["getUserInfo"]),
    },
    created() {
      this.getUser();
    },
  }
  /*
  ToDo
  ・ページリスト（HOME/ユーザーリスト→プロフィール詳細/プロフィール編集/メッセージルーム）
  ・詳細ページへのリンク
  ・サンプルの読み込みを1回にする（storeに登録→空なら読み込まない）
  ・ユーザーIDを設定する
  ・一覧ページで読み込む内容を減らす（メール・名前・画像・年齢）
  ・Editページ（detailオブジェクトにまとめる・IDで読み込み）
  ・プロフィールの内容をストアに保存
  */
</script>
