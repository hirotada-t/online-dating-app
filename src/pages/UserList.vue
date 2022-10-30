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
  import { db } from '../firebase'

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
      async getRandomUser() {
        const response = await fetch(apiURL, apiOption).then(res => res.json());
        this.randomUser = response.results;
      },
      async getUser() {
        const loginUser = JSON.parse(localStorage.getItem("userInfo"));
        const q = query(collection(db, "users"), where("email", "!=", loginUser.email));
        const queryUser = await getDocs(q);
        queryUser.forEach(doc => {
          this.userList.push(doc.data());
        });
      },
    },
    created() {
      this.getRandomUser();
      this.getUser();
    },
  }
  /*
  ToDo
  ・再読み込みのチラツキ（ローディング画面）
  ・詳細ページへのリンク
  ・サンプルの読み込みを1回にする（storeに登録→空なら読み込まない）
  */
</script>
