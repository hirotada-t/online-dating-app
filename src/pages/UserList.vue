<template>
  <q-page class="flex flex-center column">

    <h2>UserList</h2>
    <div class="q-pa-md row flex-start">
      <div class="col-3 q-px-sm q-my-sm registered-user" v-for="(user, index) in userList.registered" :key="user.name"
        @click="(e) => propClickUser(e)" :data-key="index">
        <q-card>
          <img :src="user.img">
          <q-card-section>
            <div class="balloon">一言コメント・PR</div>
            <div class="text-h6">{{user.name}}</div>
            <div class="text-subtitle2">
              age:
              <span v-if="user.birth === null">---</span>
              <span v-else>{{user.birth}}</span>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-3 q-px-sm q-my-sm sample-user" v-for="(sample, index) in userList.sample" :key="sample.id.value"
        @click="(e) => propClickUser(e)" :data-key="index">
        <q-card>
          <img :src="sample.picture.large">
          <q-card-section>
            <div class="balloon">一言コメント・PR</div>
            <div class="text-h6">{{sample.name.first}}(Sample)</div>
            <div class="text-subtitle2">age: {{sample.dob.age}}</div>
          </q-card-section>
        </q-card>
      </div>
      <q-dialog v-model="openDialog">
        <UserDetail :detail="clickedUserInfo" />
      </q-dialog>
    </div>

  </q-page>
</template>

<script>
  import { collection, query, where, getDocs } from 'firebase/firestore';
  import { db } from '../firebase';
  import { mapActions, mapGetters } from 'vuex';
  import { Loading, QSpinnerGears } from 'quasar';
  import UserDetail from 'components/UserDetail'

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
        clickedUserInfo: {},
        openDialog: false,
      }
    },

    components: {
      UserDetail
    },

    methods: {
      ...mapActions("user", ["setRegistered", "setSample"]),
      async getUser() {
        const loginUser = this.getUserInfo;
        const q = query(collection(db, "users"), where("uid", "!=", loginUser.uid));
        const queryUser = await getDocs(q);
        const arr = [];
        console.log(queryUser)
        queryUser.forEach(doc => arr.push(doc.data()));

        let response = this.getUserList.sample;
        console.log(this.getUserList)
        if (response.length === 0) {
          response = await fetch(api.url, api.option).then(res => res.json());
        }

        this.setSample(response.results);
        this.setRegistered(arr);
      },
      propClickUser(e) {
        const target = e.target.closest(".sample-user");
        let index;
        if (target == null) {
          index = e.target.closest(".registered-user").dataset.key;
          this.clickedUserInfo = this.userList.registered[index];
        } else {
          index = target.dataset.key;
          this.clickedUserInfo = this.userList.sample[index];
        }
        this.openDialog = true;
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
  ★ページリスト（HOME/ユーザーリスト→プロフィール詳細/プロフィール編集/メッセージルーム）
  ・詳細ページの作成
  ・Editページ（detailオブジェクトにまとめる・IDで読み込み）
  ・プロフィールの更新内容をストアに保存
  ・マッチングの仕組み
  ・マッチングしたユーザー同士でのメッセージのやりとり
  ・一覧ページで読み込む内容を減らす（メール・名前・画像・年齢）
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

  .balloon {
    position: relative;
    padding: 10px;
    background-color: #bdffad;
    box-shadow: 0px 0px 10px 0px #a7a7a7;

    &:before {
      content: '';
      position: absolute;
      display: block;
      width: 0;
      height: 0;
      left: 20px;
      top: -15px;
      border-right: 15px solid transparent;
      border-bottom: 15px solid #bdffad;
      border-left: 15px solid transparent;
    }
  }
</style>
