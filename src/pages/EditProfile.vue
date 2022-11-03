<template>
  <div class="q-pa-md flex flex-center" style="height: calc(100vh - 50px);">
    <q-layout view="lHh Lpr lff" container style="height: 500px" class="shadow-2 rounded-borders">

      <q-drawer v-model="drawer" :width="200" :breakpoint="400">
        <q-scroll-area style="height: calc(100% - 150px); margin-top: 150px; border-right: 1px solid #ddd">

          <q-list padding>
            <q-item active clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="inbox" />
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
                Send
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="drafts" />
              </q-item-section>

              <q-item-section>
                Drafts
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>

        <q-img class="absolute-top" src="https://cdn.quasar.dev/img/material.png" style="height: 150px">
          <div class="absolute-bottom bg-transparent">
            <q-avatar size="56px" class="q-mb-sm">
              <img src="https://cdn.quasar.dev/img/boy-avatar.png">
            </q-avatar>
            <div class="text-weight-bold">Razvan Stoenescu</div>
            <div>@rstoenescu</div>
          </div>
        </q-img>
      </q-drawer>

      <q-page-container>
        <q-page padding>
          <div class="q-pa-md" style="min-width: 800px;">
            <q-form @reset="onReset" class="q-gutter-md">
              <h2 class="q-mb-sm q-mt-xl">基本情報</h2>
              <q-separator inset />
              <q-input filled v-model="name" label="ニックネーム" />
              <q-input filled v-model="birth" label="生年月日" type="number" />
              <q-input filled v-model="gender" label="性別" />
              <q-input filled v-model="image" label="画像" />
              <h2 class="q-mb-sm q-mt-xl">自己PR</h2>
              <q-separator inset />
              <q-input filled v-model="pr" label="ひとことPR" />
              <q-input filled v-model="preference" label="好みのタイプ" />
              <q-input filled v-model="work" label="仕事" />
              <q-input filled v-model="hobby" label="趣味" />
              <q-input filled v-model="introduction" label="自己紹介" />
              <div class="flex justify-center">
                <q-btn label="Submit" type="submit" color="primary" size="20px" class="q-px-xl q-py-xs" />
                <q-btn label="Reset" type="reset" color="primary" flat size="20px" class="q-px-xl q-py-xs q-ml-sm" />
              </div>
            </q-form>
          </div>
        </q-page>
      </q-page-container>
    </q-layout>
  </div>
</template>

<script>

  export default {
    name: 'EditProfile',
    data() {
      return {
        name: null,
        age: null,
      }
    },

    methods: {
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

      onReset() {
        this.name = null
        this.age = null
      }
    }
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
