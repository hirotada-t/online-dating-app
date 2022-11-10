<template>
  <div class="q-pa-md flex flex-center" style="height: calc(100vh - 50px);">
    <q-layout view="lHh Lpr lff" container style="height: 600px; max-width: 800px;" class="shadow-2 rounded-borders">

      <q-drawer v-model="drawer" :width="200" :breakpoint="400">
        <q-scroll-area style="height: calc(100% - 150px); margin-top: 150px; border-right: 1px solid #ddd">

          <q-list padding>
            <q-item clickable v-ripple href="#profile">
              <q-item-section avatar>
                <q-icon name="fa-regular fa-circle-user" />
              </q-item-section>
              <q-item-section>
                基本情報
              </q-item-section>
            </q-item>

            <q-item active clickable v-ripple href="#introduction">
              <q-item-section avatar>
                <q-icon name="star" />
              </q-item-section>
              <q-item-section>
                自己PR
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple to="contact">
              <q-item-section avatar>
                <q-icon name="send" />
              </q-item-section>
              <q-item-section>
                お問い合わせ
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple @click="openDialog = true">
              <q-item-section avatar>
                <q-icon name="fa-regular fa-face-sad-tear" />
              </q-item-section>
              <q-item-section>
                退会する
              </q-item-section>
            </q-item>

            <q-separator />

            <q-item class="flex flex-center q-mt-md">
              <q-btn label="保存する" type="submit" color="primary" size="15px" class="q-px-lg" @click="updateInfo()" />
            </q-item>
          </q-list>
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
            アカウントを削除して退会します。<br>
            本当によろしいですか？
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Cancel" color="primary" v-close-popup />
            <q-btn label="退会する" color="negative" v-close-popup class="q-px-md" @click="withdrawal" />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <q-page-container id="profile">
        <q-page padding>
          <div class="q-pa-md">
            <q-form class="q-gutter-md">
              <h3 class="q-mb-sm">基本情報</h3>
              <q-separator inset />
              <q-input filled v-model="userInfo.displayName" label="ニックネーム" />
              <q-input filled v-model="userInfo.birthDay" :rules="[
              val => val.slice(0, 4) < getToday.y || val.slice(5, 7) < getToday.m || val.slice(8, 10) < getToday.d|| '過去の日付を入力してください。'
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
              <q-select filled v-model="userInfo.gender" :options="options" label="性別" />
              <q-file filled v-model="userInfo.photoURL" accept=".jpg, image/*" @rejected="imgRejected">
                <template v-slot:prepend>
                  <q-icon name="fa-regular fa-image" />
                </template>
              </q-file>
              <h3 class="q-mb-sm q-mt-xl" id="introduction">自己PR</h3>
              <q-separator inset />
              <q-input filled v-model="userInfo.prof.pr" label="ひとことPR" />
              <q-input filled v-model="userInfo.prof.preferredType" label="好みのタイプ" />
              <q-input filled v-model="userInfo.prof.work" label="仕事" />
              <q-input filled v-model="userInfo.prof.hobby" label="趣味" />
              <q-input filled v-model="userInfo.prof.introduction" type="textarea" label="自己紹介" />
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
  import { auth, db } from '../firebase';
  import { Notify, date } from 'quasar';

  export default {
    name: 'EditProfile',
    data() {
      return {
        userInfo: {},
        options: ["", "男性", "女性"],
        drawer: true,
        openDialog: false,
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
        this.setLoginUser(this.userInfo);

        const q = query(collection(db, "users"), where("uid", "==", this.getUserInfo.uid));
        const docRef = await getDocs(q);
        const id = docRef.docs[0].id;

        await setDoc(doc(db, "users", id), {
          displayName: this.getUserInfo.displayName,
          gender: this.validateInfo(this.userInfo.gender),
          birthDay: this.validateInfo(this.userInfo.birthDay),
        }, { merge: true });
        this.$q.notify({
          message: 'データを更新しました。',
          color: 'primary',
          timeout: 1500,
        });
      },
      validateInfo(value) {
        return typeof value === "undefined" ? "" : value;
      },
    },

    computed: {
      ...mapGetters("user", ["getUserInfo", "getUserList", "getToday"]),
    },

    created() {
      const str = JSON.stringify(this.getUserInfo);
      this.userInfo = JSON.parse(str);
    },
  }
  /*
  （自己紹介）
  ・ひとことPR（～28字）
  ・好みのタイプ
  ・仕事
  ・趣味
  ・その他コメント（～160字）
  */
</script>
