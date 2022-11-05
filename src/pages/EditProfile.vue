<template>
  <div class="q-pa-md flex flex-center" style="height: calc(100vh - 50px);">
    <q-layout view="lHh Lpr lff" container style="height: 600px; max-width: 800px;" class="shadow-2 rounded-borders">

      <q-drawer v-model="drawer" :width="200" :breakpoint="400">
        <q-scroll-area style="height: calc(100% - 150px); margin-top: 150px; border-right: 1px solid #ddd">

          <q-list padding>
            <q-item active clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="fa-regular fa-circle-user" />
              </q-item-section>
              <q-item-section>
                基本情報
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="star" />
              </q-item-section>
              <q-item-section>
                自己PR
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="send" />
              </q-item-section>
              <q-item-section>
                お問い合わせ
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="fa-regular fa-face-sad-tear" />
              </q-item-section>
              <q-item-section>
                退会する
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
            <div>@sample</div>
          </div>
        </q-img>
      </q-drawer>

      <q-page-container>
        <q-page padding>
          <div class="q-pa-md">
            <q-form class="q-gutter-md">
              <h3 class="q-mb-sm">基本情報</h3>
              <q-separator inset />
              <q-input filled v-model="userInfo.displayName" label="ニックネーム" />
              <q-input filled v-model="userInfo.birth" label="生年月日" type="date" />
              <q-select filled v-model="userInfo.gender" :options="options" label="性別" />
              <q-file filled v-model="userInfo.photoURL" accept=".jpg, image/*" @rejected="onRejected">
                <template v-slot:prepend>
                  <q-icon name="fa-regular fa-image" />
                </template>
              </q-file>
              <div class="flex justify-center">
                <q-btn label="Submit" type="submit" color="primary" size="20px" class="q-px-xl q-py-xs" />
              </div>
            </q-form>
          </div>
          <!-- <div class="q-pa-md">
            <q-form class="q-gutter-md">
              <h3 class="q-mb-sm q-mt-xl">自己PR</h3>
              <q-separator inset />
              <q-input filled v-model="pr" label="ひとことPR" />
              <q-input filled v-model="preference" label="好みのタイプ" />
              <q-input filled v-model="work" label="仕事" />
              <q-input filled v-model="hobby" label="趣味" />
              <q-input filled v-model="introduction" label="自己紹介" />
              <div class="flex justify-center">
                <q-btn label="Submit" type="submit" color="primary" size="20px" class="q-px-xl q-py-xs" />
              </div>
            </q-form>
          </div> -->
        </q-page>
      </q-page-container>
    </q-layout>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';

  export default {
    name: 'EditProfile',
    data() {
      return {
        userInfo: {},
        options: ["", "男性", "女性"],
        drawer: true,
      }
    },

    methods: {
      ...mapActions("user", ["setRegistered", "setSample"]),
      onSubmit() {
        if (this.accept !== true) {
          this.$q.notify({
            color: 'red-5',
            textColor: 'white',
            icon: 'warning',
            message: 'You need to accept the license and terms first'
          })
        }
        else {
          this.$q.notify({
            color: 'green-4',
            textColor: 'white',
            icon: 'cloud_done',
            message: 'Submitted'
          })
        }
      },
      onRejected(rejectedEntries) {
        this.$q.notify({
          type: 'negative',
          message: "画像を選択してください"
        })
      }
    },

    computed: {
      ...mapGetters("user", ["getUserInfo", "getUserList"]),
    },

    created() {
      const str = JSON.stringify(this.getUserInfo);
      this.userInfo = JSON.parse(str);
    },
  }
  /*
  （基本情報）
  ・ニックネーム
  ・年齢
  ・画像
  ・性別
  （自己紹介）
  ・ひとことPR（～28字）
  ・好みのタイプ
  ・仕事
  ・趣味
  ・その他コメント（～160字）
  */
</script>
