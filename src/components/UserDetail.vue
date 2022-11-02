<template>
  <q-card>
    <q-card-section>
      <div class="text-h6">Alert</div>
    </q-card-section>
    <q-card-actions align="right">
      {{userDetail}}
      <q-btn flat label="OK" color="primary" v-close-popup />
    </q-card-actions>
  </q-card>
</template>

<script>
  export default {
    name: 'UserDetail',
    props: {
      detail: {
        type:Object,
      }
    },
    data() {
      return {
        userDetail: this.detail,
      }
    },
  }
</script>
