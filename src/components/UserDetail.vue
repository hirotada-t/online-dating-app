<template>
  <q-card class="row detail-page">
    <div class="col-12 col-sm-5 q-px-md q-pt-md">
      <img :src="userDetail.photoURL" style="width: 100%;border-radius: 100px;">
      <div class="balloon">
        <div v-if="userDetail.pr === ''">No comment</div>
        <div class="over-text-hidden" v-else>{{userDetail.pr}}</div>
      </div>
    </div>
    <q-card-section class="order-sm-last col-12 col-sm-7">
      <div class="text-h3 over-text-hidden">{{userDetail.displayName}}</div>
      <div class="text-h6">
        age:{{userDetail.birthDay === "" ? "secret" : userAge}}
      </div>
      <div class="text-h6">gender: {{userDetail.gender === "" ? "secret" : userDetail.gender}}</div>
      <div class="text-h6">preferred type: {{userDetail.preferredType === "" ? "secret" : userDetail.preferredType}}
      </div>
      <div class="text-h6">work: {{userDetail.work === "" ? "secret" : userDetail.work}}</div>
      <div class="text-h6">hobby: {{userDetail.hobby === "" ? "secret" : userDetail.hobby}}</div>
      <div class="text-h6">introduction: {{userDetail.introduction === "" ? "Please remember me!" :
        userDetail.introduction}}</div>
      <q-card-actions align="center">
        <q-btn flat label="close" color="primary" v-close-popup />
        <q-btn v-if="userDetail.uid.slice(0,6) === 'sample'" padding="5px 20px" push :loading="loading" color="primary"
          @click="requestLoad()" style="width: 150px">
          <span v-if="typeof getSampleMatchingList[userDetail.uid.charAt(6)] === 'undefined'">Send Request</span>
          <span v-else>start to talk</span>
          <template v-slot:loading>
            <q-spinner-hourglass class="on-left" />
            Please wait...
          </template>
        </q-btn>
      </q-card-actions>
    </q-card-section>
  </q-card>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';
  import { birthToAge } from '../functions/index.js';
  import { auth, db, storage } from '../firebase';
  import { setDoc, collection, query, where, getDocs, doc, deleteDoc } from 'firebase/firestore';

  export default {
    name: 'UserDetail',

    props: {
      detail: Object,
    },

    data() {
      return {
        userDetail: this.detail,
        userAge: birthToAge(this.detail.birthDay),
        loading: false,
      }
    },

    methods: {
      ...mapActions("user", ["setMatchingList", "setSampleMatchingList"]),
      async requestLoad() {
        if (this.userDetail.uid.slice(0, 6) === "sample") {
          const num = this.userDetail.uid.charAt(6);
          for (let i = 0; i < this.getSampleMatchingList.length; i++) {
            if (this.getSampleMatchingList[i].uid.charAt(6) === num) {
              this.$router.push({
                name: 'message',
                params: { matchingUser: this.userDetail }
              });
              return;
            }
          }
          this.setSampleMatchingList(this.userDetail);
          alert("マッチングしました");
          this.$router.push({
            name: 'message',
            params: { matchingUser: this.userDetail }
          });
        } else {
          this["loading"] = true;
          setTimeout(() => {
            this.sendRequest();
            alert("リクエストを送りました");
            this["loading"] = false;
          }, 2000);
        }
      },
      async sendRequest() {
        // リクエストを送る処理内容
        const q = query(collection(db, "users"), where("uid", "==", this.getUserInfo.uid));
        const docRef = await getDocs(q);
        const id = docRef.docs[0].id;
        await setDoc(doc(db, "users", id), this.getUserInfo, { merge: true });
      },
    },

    computed: {
      ...mapGetters("user", ["getUserInfo", "getMatchingList", "getSampleMatchingList"]),
    },
  }
</script>

<style lang="scss" scoped>
  .q-card {
    cursor: default;

    &:hover {
      transform: translate(0, 0);
    }
  }

  .detail-page {
    width: 100%;
    max-width: 1000px;
    padding: 50px 30px;
  }
</style>
