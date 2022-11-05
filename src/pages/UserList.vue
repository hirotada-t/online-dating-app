<template>
  <q-page>
    <div class="" v-if="nowLoading"></div>
    <div class="flex flex-center column" v-else>
      <h2>UserList</h2>
      <div class="q-pa-md row flex-start" :class="{hidden: nowLoading}">
        <div class="col-12 col-sm-4 col-md-3 q-px-sm q-my-sm registered-user"
          v-for="(user, index) in userList.registered" :key="user.name" @click="(e) => propClickUser(e)"
          :data-key="index">
          <q-card class="row">
            <img :src="user.img" class="col-5 col-sm-12 q-px-md q-pt-md">
            <q-card-section class="order-sm-last col-7 col-sm-12">
              <div class="text-h6">{{user.name}}</div>
              <div class="text-subtitle2">
                age:
                <span v-if="user.birth === null">---</span>
                <span v-else>{{user.birth}}</span>
              </div>
            </q-card-section>
            <q-card-section class="col">
              <div class="balloon">一言コメント・PR</div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-12 col-sm-4 col-md-3 q-px-sm q-my-sm sample-user" v-for="(sample, index) in userList.sample"
          :key="sample.id.value" @click="(e) => propClickUser(e)" :data-key="index">
          <q-card class="row">
            <img :src="sample.picture.large" class="col-5 col-sm-12 q-px-md q-pt-md">
            <q-card-section class="order-sm-last col-7 col-sm-12">
              <div class="text-h6">{{sample.name.first}}(Sample)</div>
              <div class="text-subtitle2">age: {{sample.dob.age}}</div>
            </q-card-section>
            <q-card-section class="col">
              <div class="balloon">一言コメント・PR</div>
            </q-card-section>
          </q-card>
        </div>
        <q-dialog v-model="openDialog">
          <UserDetail :detail="clickedUserInfo" />
        </q-dialog>
      </div>
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
        nowLoading: true,
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
        queryUser.forEach(doc => arr.push(doc.data()));

        const response = await fetch(api.url, api.option).then(res => res.json());

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
      const list = JSON.parse(localStorage.getItem("userList"));
      const storelist = this.getUserList;
      if (list != null) {
        // ローカルにリストが保存されている時（ページ更新時）
        this.setRegistered(list.registered);
        this.setSample(list.sample);
      } else if (storelist.registered.length === 0 || storelist.sample.length === 0) {
        // ローカルにもストアにもリストが無い場合（ログイン時）
        this.getUser();
      }
      this.userList = this.getUserList;
      // 更新する直前でユーザーリストを保存する
      window.addEventListener("beforeunload", this.holdUsersAtReload);
    },
    mounted() {
      const storelist = this.getUserList;
      this.$nextTick(() => {
        this.timer = setTimeout(() => {
          this.$q.loading.hide()
          this.timer = void 0
          this.nowLoading = false;
        }, 1500)
      })
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
