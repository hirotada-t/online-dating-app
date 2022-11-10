<template>
  <q-page>
    <div class="" v-if="nowLoading"></div>
    <div class="flex flex-center column" v-else>
      <h2>UserList</h2>
      <div class="q-pa-md row flex-start" :class="{hidden: nowLoading}">
        <div class="col-12 col-sm-4 col-md-3 q-px-sm q-my-sm registered-user"
          v-for="(user, index) in userList.registered" :key="user.displayName" @click="(e) => propClickUser(e)"
          :data-key="index">
          <q-card class="row">
            <img :src="user.photoURL" class="col-5 col-sm-12 q-px-md q-pt-md" style="border-radius: 150px;">
            <q-card-section class="order-sm-last col-7 col-sm-12">
              <div class="text-h6 over-text-hidden">{{user.displayName}}</div>
              <div class="text-subtitle2 over-text-hidden">
                age:
                <span v-if="user.birthDay === ''">秘密</span>
                <span v-else>{{birthToAge(user.birthDay)}}</span>
              </div>
            </q-card-section>
            <q-card-section class="col">
              <div class="balloon over-text-hidden" v-if="user.pr === ''">コメントはありません。</div>
              <div class="balloon over-text-hidden" v-else>{{user.pr}}</div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-12 col-sm-4 col-md-3 q-px-sm q-my-sm sample-user" v-for="(sample, index) in userList.sample"
          :key="sample.id.value" @click="(e) => propClickUser(e)" :data-key="index">
          <q-card class="row">
            <img :src="sample.picture.large" class="col-5 col-sm-12 q-px-md q-pt-md" style="border-radius: 150px;">
            <q-card-section class="order-sm-last col-7 col-sm-12">
              <div class="text-h6 over-text-hidden">{{sample.name.first}}(Sample)</div>
              <div class="text-subtitle2 over-text-hidden">age: {{sample.dob.age}}</div>
            </q-card-section>
            <q-card-section class="col">
              <div class="balloon over-text-hidden">一言コメント</div>
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
        const arr = [];
        const loginUser = this.getUserInfo;
        const q = query(collection(db, "users"), where("uid", "!=", loginUser.uid));
        const queryUser = await getDocs(q);
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
