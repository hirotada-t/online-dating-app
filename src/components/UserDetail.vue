<template>
  <q-card class="row detail-page">
    <div class="col-12 col-sm-5 q-px-md q-pt-md">
      <img :src="userDetail.photoURL" style="width: 100%;border-radius: 100px;">
      <div class="balloon over-text-hidden" v-if="userDetail.pr === ''">No comment</div>
      <div class="balloon over-text-hidden" v-else>{{userDetail.pr}}</div>
    </div>
    <q-card-section class="order-sm-last col-12 col-sm-7">
      <div class="text-h3 over-text-hidden">{{userDetail.displayName}}</div>
      <div class="text-h6">
        age:{{userDetail.birthDay === "" ? "secret" : userAge}}
      </div>
      <div class="text-h6">gender: {{userDetail.gender === "" ? "secret" : userDetail.gender}}</div>
      <div class="text-h6">preferred type: {{userDetail.preferredType === "" ? "secret" : userDetail.preferredType}}</div>
      <div class="text-h6">work: {{userDetail.work === "" ? "secret" : userDetail.work}}</div>
      <div class="text-h6">hobby: {{userDetail.hobby === "" ? "secret" : userDetail.hobby}}</div>
      <div class="text-h6">introduction: {{userDetail.introduction === "" ? "Please remember me!" : userDetail.introduction}}</div>
      <q-card-actions align="center">
        <q-btn flat label="close" color="primary" v-close-popup />
        <q-btn padding="5px 20px" push :loading="loading" color="primary" @click="simulateProgress(4)" style="width: 150px">
          Send Request
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
  export default {
    name: 'UserDetail',

    props: {
      detail: Object,
      age: Number,
    },

    data() {
      return {
        userDetail: this.detail,
        userAge: this.age,
        loading: false,
      }
    },

    methods: {
      simulateProgress() {
        this["loading"] = true
        setTimeout(() => {
          this["loading"] = false
        }, 3000);
      },
    },

    computed: {
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
