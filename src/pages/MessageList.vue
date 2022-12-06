<template>
  <div class="q-pa-md flex flex-center">

    <q-drawer elevated v-model="right" :width="300" :breakpoint="400">
      <q-scroll-area style="height: calc(100% - 150px); border-right: 1px solid #ddd">
        <q-list padding>
          <q-item active clickable v-ripple href="#introduction">
            <q-item-section avatar>
              <img :src="matchingUser.photoURL" alt="" class="w-40px rounded100">
            </q-item-section>
            <q-item-section>
              {{matchingUser.displayName}}
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>
    {{matchingUser}}

    {{$store.state.user.userList}}

  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';
  import { signOut } from 'firebase/auth';
  import { setDoc, collection, query, where, getDocs, doc, deleteDoc } from 'firebase/firestore';
  import { auth, db, storage } from '../firebase';
  import { getStorage, ref, uploadBytes } from "firebase/storage";
  import { Notify, date } from 'quasar';

  export default {
    name: 'MessageList',
    props: ["matchingUser"],
    data() {
      return {
        right: true,
      }
    },

    methods: {
      ...mapActions("user", ["setLoginUser", "reset"]),
    },

    computed: {
      ...mapGetters("user", ["getUserInfo", "getUserList"]),
    },

    created() {
      this.userInfo = structuredClone(this.getUserInfo);
    },
  }
</script>

<style lang="scss">
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
