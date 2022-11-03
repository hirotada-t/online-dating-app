<template>
  <q-page class="flex flex-center">
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
