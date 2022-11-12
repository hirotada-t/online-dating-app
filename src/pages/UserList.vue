<template>
  <q-page>
    <div class="" v-if="nowLoading"></div>
    <div class="flex flex-center column" v-else>
      <h2>UserList</h2>
      <div class="q-pa-md row flex-start" :class="{hidden: nowLoading}">
        <div class="col-12 col-sm-4 col-md-3 q-px-sm q-my-sm clicked-user" v-for="(user, index) in userList"
          :key="user.displayName" @click="(e) => propClickUser(e)" :data-key="index">
          <q-card class="row">
            <div class="col-5 col-sm-12 q-px-md q-pt-md">
              <img :src="user.photoURL" style="width: 100%;border-radius: 150px;">
            </div>
            <q-card-section class="order-sm-last col-7 col-sm-12">
              <div class="text-h6 over-text-hidden">{{user.displayName}}</div>
              <div class="text-subtitle2 over-text-hidden">
                age: {{user.birthDay === "" ? "secret" : birthToAge(user.birthDay)}}
              </div>
            </q-card-section>
            <q-card-section class="col">
              <div class="balloon over-text-hidden" v-if="user.pr === ''">No comment</div>
              <div class="balloon over-text-hidden" v-else>{{user.pr}}</div>
            </q-card-section>
          </q-card>
        </div>
        <q-dialog v-model="openDialog">
          <UserDetail :detail="clickedUserInfo" :age="userAge" />
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
        userList: [],
        userAge: "",
        clickedUserInfo: {},
        openDialog: false,
      }
    },

    components: {
      UserDetail
    },

    methods: {
      ...mapActions("user", ["setRegistered", "setSample", "setUserList"]),
      async getUser() {
        const loginUser = this.getUserInfo;
        const q = query(collection(db, "users"), where("uid", "!=", loginUser.uid));
        const queryUser = await getDocs(q);
        queryUser.forEach(doc => this.setUserList(doc.data()));

        const response = await fetch(api.url, api.option).then(res => res.json());
        for (let i = 0; i < response.results.length; i++) {
          this.setUserList({
            displayName: response.results[i].name.first + " " + response.results[i].name.last + "(Sample)",
            photoURL: response.results[i].picture.large,
            uid: "sample" + i,
            birthDay: response.results[i].dob.date,
            gender: response.results[i].gender,
            pr: "I'm sample user.",
            preferredType: "sample",
            work: "sample",
            hobby: "sample",
            introduction: "Please remember me!",
          });
        }
      },
      propClickUser(e) {
        const index = e.target.closest(".clicked-user").dataset.key;
        this.clickedUserInfo = this.userList[index];
        this.userAge = this.birthToAge(this.clickedUserInfo.birthDay);
        this.openDialog = true;
      },
      holdUsersAtReload() {
        const userListString = JSON.stringify(this.getUserList);
        localStorage.setItem("userList", userListString);
      },
      birthToAge(birthDay) {
        let age = this.getToday.y - birthDay.slice(0, 4);
        if (this.getToday.m - birthDay.slice(5, 7) < 0 || this.getToday.d - birthDay.slice(8, 10) < 0) {
          age--;
        }
        return age;
      },
    },

    computed: {
      ...mapGetters("user", ["getUserInfo", "getUserList", "getToday"]),
    },

    created() {
      this.$q.loading.show();
      const listInLocal = JSON.parse(localStorage.getItem("userList"));
      const listInStore = this.getUserList;
      if (listInLocal != null) {
        // ローカルにリストが保存されている時（ページ更新時）
        listInLocal.forEach(user => this.setUserList(user));
      } else if (listInStore.length === 0) {
        // ローカルにもストアにもリストが無い場合（ログイン時）
        this.getUser();
      }
      this.userList = this.getUserList;
      window.addEventListener("beforeunload", this.holdUsersAtReload);
    },

    mounted() {
      const listInStore = this.getUserList;
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
  ★ページ（HOME/ユーザーリスト→プロフィール詳細/プロフィール編集/メッセージルーム/メッセージ一覧）
  ★未（HOME/プロフィール詳細/メッセージルーム/メッセージ一覧）
  ・ストレージに画像をアップロード
  ・詳細ページの作成
  ・マッチングの仕組み
  ・マッチングしたユーザー同士でのメッセージのやりとり
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

  .over-text-hidden {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
</style>
