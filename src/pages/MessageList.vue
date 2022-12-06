<template>
  <div class="q-pa-md flex flex-center" style="height: calc(100vh - 50px);">
    <q-layout view="lHh Lpr lff" container style="height: 600px; max-width: 800px;"
      class="shadow-2 rounded-borders bg-white">

      <q-drawer v-model="drawer" :width="200" :breakpoint="400">
        <q-scroll-area style="height: calc(100% - 150px); margin-top: 150px; border-right: 1px solid #ddd">

          <q-list padding>

            <q-item active clickable v-ripple href="#introduction">
              <q-item-section avatar>
                <q-icon name="star" />
              </q-item-section>
              <q-item-section>
                Profile
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>

        <q-img class="absolute-top" src="https://cdn.quasar.dev/img/material.png" style="height: 150px">
          <div class="absolute-bottom bg-transparent">
            <q-avatar size="56px" class="q-mb-sm">
              <img :src="$store.state.user.info.photoURL">
            </q-avatar>
            <div class="text-weight-bold">{{$store.state.user.info.displayName}}</div>
            <!-- <div>@sample</div> -->
          </div>
        </q-img>
      </q-drawer>

      <q-page-container id="profile">
        <q-page padding>
          <div class="q-pa-md">
            <h3 class="q-mb-sm">Information</h3>
          </div>
        </q-page>
      </q-page-container>
    </q-layout>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';
  import { signOut } from 'firebase/auth';
  import { setDoc, collection, query, where, getDocs, doc, deleteDoc } from 'firebase/firestore';
  import { auth, db, storage } from '../firebase';
  import { getStorage, ref, uploadBytes } from "firebase/storage";
  import { Notify, date } from 'quasar';
  import { getToday, birthToAge } from '../functions/index.js'

  export default {
    name: 'MessageList',
    data() {
      return {
        userInfo: {},
        options: ["", "male", "female"],
        drawer: true,
        openDialog: false,
        openPreview: false,
        today: getToday(),
      }
    },

    methods: {
      ...mapActions("user", ["setLoginUser", "reset"]),
      imgRejected(rejectedEntries) {
        this.$q.notify({
          type: 'negative',
          message: "画像を選択してください"
        })
      },
      birthRejected(rejectedEntries) {
        this.$q.notify({
          type: 'negative',
          message: "画像を選択してください"
        })
      },
      async withdrawal() {
        const q = query(collection(db, "users"), where("uid", "==", this.getUserInfo.uid));
        const docRef = await getDocs(q);
        const id = docRef.docs[0].id;
        await deleteDoc(doc(db, "users", id));
        signOut(auth).then(() => {
          localStorage.clear();
          this.reset();
        });
        this.$router.push('/');
      },
      async updateInfo() {
        const imageRef = ref(storage, this.userInfo.photoURL.name);

        if (!imageRef) {
          uploadBytes(imageRef, this.userInfo.photoURL.file).then((snapshot) => {
            console.log('Uploaded a blob or file!');
          });
        }
        this.setLoginUser(this.userInfo);

        const q = query(collection(db, "users"), where("uid", "==", this.getUserInfo.uid));
        const docRef = await getDocs(q);
        const id = docRef.docs[0].id;

        await setDoc(doc(db, "users", id), this.userInfo, { merge: true });
        this.$q.notify({
          message: 'データを更新しました。',
          color: 'primary',
          timeout: 1500,
        });
      },
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
