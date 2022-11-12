<template>
  <q-card class="row">
    <img :src="userDetail.photoURL" class="col-5 col-sm-12 q-px-md q-pt-md" style="border-radius: 150px;">
    <q-card-section class="order-sm-last col-7 col-sm-12">
      <div class="text-h6 over-text-hidden">{{userDetail.displayName}}</div>
      <div class="text-subtitle2 over-text-hidden">
        age:
        <span v-if="userDetail.birthDay === ''">秘密</span>
        <span v-else>{{userAge}}</span>
      </div>
    </q-card-section>
    <q-card-section class="col">
      <div class="balloon over-text-hidden" v-if="userDetail.pr === ''">コメントはありません。</div>
      <div class="balloon over-text-hidden" v-else>{{userDetail.pr}}</div>
    </q-card-section>
    <q-card-actions align="right">
      <q-btn flat label="OK" color="primary" v-close-popup />
    </q-card-actions>
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
      }
    },

    methods: {
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
</style>
