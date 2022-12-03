<template>
  <div class="q-pa-md flex flex-center" style="height: calc(100vh - 50px);">
    <q-layout view="lHh Lpr lff" container style="height: 600px; max-width: 800px;"
      class="shadow-2 rounded-borders bg-white">

      <q-drawer v-model="drawer" :width="200" :breakpoint="400">
        <q-scroll-area style="height: calc(100% - 150px); margin-top: 150px; border-right: 1px solid #ddd">

          <q-list padding>
            <q-item clickable v-ripple href="#profile">
              <q-item-section avatar>
                <q-icon name="fa-regular fa-circle-user" />
              </q-item-section>
              <q-item-section>
                Information
              </q-item-section>
            </q-item>

            <q-item active clickable v-ripple href="#introduction">
              <q-item-section avatar>
                <q-icon name="star" />
              </q-item-section>
              <q-item-section>
                Profile
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple to="contact">
              <q-item-section avatar>
                <q-icon name="send" />
              </q-item-section>
              <q-item-section>
                Contact
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple @click="openDialog = true">
              <q-item-section avatar>
                <q-icon name="fa-regular fa-face-sad-tear" />
              </q-item-section>
              <q-item-section>
                Withdrawal
              </q-item-section>
            </q-item>

            <q-separator />

            <q-item class="flex flex-center q-my-md">
              <q-btn label="save" type="submit" color="primary" size="15px" class="q-px-lg" @click="updateInfo()" />
            </q-item>

            <q-separator />

            <q-item class="flex flex-center q-mt-md">
              <q-btn label="preview" type="submit" color="primary" size="15px" class="q-px-lg" @click="openPreview = true"/>
            </q-item>
          </q-list>
          <q-dialog v-model="openPreview">
            <UserDetail :detail="userInfo" :age=1 />
          </q-dialog>
        </q-scroll-area>

        <q-img class="absolute-top" src="https://cdn.quasar.dev/img/material.png" style="height: 150px">
          <div class="absolute-bottom bg-transparent">
            <q-avatar size="56px" class="q-mb-sm">
              <img :src="$store.state.user.info.photoURL">
            </q-avatar>
            <div class="text-weight-bold">{{$store.state.user.info.displayName}}</div>
            <div>@sample</div>
          </div>
        </q-img>
      </q-drawer>

      <q-dialog v-model="openDialog">
        <q-card>
          <q-card-section class="row items-center">
            Delete your account and cancel your membership.<br>
            Are you sure you want to do this?
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Cancel" color="primary" v-close-popup />
            <q-btn label="Withdrawal" color="negative" v-close-popup class="q-px-md" @click="withdrawal" />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <q-page-container id="profile">
        <q-page padding>
          <div class="q-pa-md">
            <q-form class="q-gutter-md">
              <h3 class="q-mb-sm">Information</h3>
              <q-separator inset />
              <q-input filled v-model="userInfo.displayName" label="Nick name" counter maxlength="10">
                <template v-slot:hint>
                  Field hint
                </template>
              </q-input>
              <q-input filled v-model="userInfo.birthDay" :rules="[
              val => val.slice(0, 4) < getToday.y || val.slice(5, 7) < getToday.m || val.slice(8, 10) < getToday.d|| 'Enter a date in the past.'
              ]">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                      <q-date v-model="userInfo.birthDay" mask="YYYY-MM-DD">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Close" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
              <q-select filled v-model="userInfo.gender" :options="options" label="gender" />
              <q-file filled v-model="userInfo.photoURL" accept=".jpg, image/*" @rejected="imgRejected">
                <template v-slot:prepend>
                  <q-icon name="fa-regular fa-image" />
                </template>
              </q-file>
              <h3 class="q-mb-sm q-mt-xl" id="introduction">Profile</h3>
              <q-separator inset />
              <q-input filled v-model="userInfo.pr" label="short comment" />
              <q-input filled v-model="userInfo.preferredType" label="preferred type" />
              <q-input filled v-model="userInfo.work" label="work" />
              <q-input filled v-model="userInfo.hobby" label="hobby" />
              <q-input filled v-model="userInfo.introduction" type="textarea" label="introduction" counter maxlength="500">
                <template v-slot:hint>
                  Field hint
                </template>
              </q-input>
            </q-form>
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
  import UserDetail from 'components/UserDetail'

  export default {
    name: 'EditProfile',
    data() {
      return {
        userInfo: {},
        options: ["", "male", "female"],
        drawer: true,
        openDialog: false,
        openPreview: false,
      }
    },

    components: {
      UserDetail
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
      ...mapGetters("user", ["getUserInfo", "getUserList", "getToday"]),
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
