<template>
  <div class="flex flex-center">

    <q-drawer elevated v-model="right">
      <q-scroll-area style="height: calc(100% - 150px); border-right: 1px solid #ddd">
        <div v-if="Object.keys(getSampleMatchingList).length === 0" class="text-center q-mt-lg">
          No matching...
        </div>
        <q-list v-else padding>
          <q-item active clickable v-ripple href="#introduction" v-for="u in getSampleMatchingList" :key="u.uid">
            <q-item-section avatar>
              <img :src="u.photoURL" alt="" class="w-40px rounded100">
            </q-item-section>
            <q-item-section>
              {{u.displayName}}
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page style="width: 100%;" v-if="Object.keys(getSampleMatchingList).length > 0">
      <div class="bg-grey-9 text-white text-h5 q-pa-md">
        {{sampleMatching.displayName}}
      </div>
      <!--画面-->
      <div id="field">
        <ul id="chat-ul"></ul>
      </div>

      <!--入力場所，送信ボタン-->
      <div id="input-field" class="flex flex-center q-px-sm">
        <input type="text" id="chat-input">
        <input type="button" value="Send" id="chat-button" @click="btnFunc">
      </div>
    </q-page>

  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';
  import { signOut } from 'firebase/auth';
  import { setDoc, collection, query, where, getDocs, doc, deleteDoc } from 'firebase/firestore';
  import { auth, db, storage } from '../firebase';
  import { getStorage, ref, uploadBytes } from "firebase/storage";
  import { Notify, date } from 'quasar';

  // ロボットの返答内容
  const chat = [
    'Hello ! Welcome to AI chat !',
    'What is your name ?',
    'How are you today ?',
    ['Alright !', 'Oh really!', 'Ok!'],
  ];
  let chatCount = 0;

  export default {
    name: 'MessageList',
    props: ["matchingUser"],
    data() {
      return {
        sampleMatching: this.matchingUser,
        sampleMatchingList: [],
        right: true,
      }
    },

    methods: {
      ...mapActions("user", ["setLoginUser"]),
      output(val, person) {
        const field = document.getElementById('field');
        const chatBtn = document.getElementById('chat-button');
        field.scroll(0, field.scrollHeight - field.clientHeight);

        const ul = document.getElementById('chat-ul');
        const li = document.createElement('li');
        const div = document.createElement('div');
        div.textContent = val;

        if (person === 'me') { // 自分
          div.classList.add('chat-right');
          li.classList.add('text-right');
          ul.appendChild(li);
          li.appendChild(div);
        } else if (person === 'robot') { // 相手
          chatBtn.disabled = true;
          setTimeout(() => {
            chatBtn.disabled = false;
            div.classList.add('chat-left');
            li.classList.add('text-left');
            ul.appendChild(li);
            li.appendChild(div);
            chatCount++;
          }, 2000);
        }
      },
      btnFunc() {
        const inputText = document.getElementById('chat-input');
        if (!inputText.value) return false;
        this.output(inputText.value, 'me');

        setTimeout(() => {
          inputText.value = '';
        }, 1);

        //ロボットの送信の合計回数に応じて次の返信を指定
        switch (chatCount) {
          case 2:
            this.output('Hi, ' + inputText.value + ' !', 'robot');
            setTimeout(() => {
              this.output(chat[2], 'robot');
            }, 2000);
            break;

          case 4:
            this.output(chat[3][Math.floor(Math.random() * chat[3].length)], 'robot');
            break;

          default:
            this.output(inputText.value, 'robot');
            break;
        }
      },
      holdMessageAtReload() {

      }
    },

    computed: {
      ...mapGetters("user", ["getUserInfo", "getUserList", "getSampleMatchingList"]),
    },

    created() {

      window.addEventListener("beforeunload", this.holdMessageAtReload);
    },

    mounted() {
      this.output(chat[0], 'robot');
      setTimeout(() => {
        this.output(chat[1], 'robot');
      }, 2000);
    }
  }
</script>

<style lang="scss">
  .q-page-container {
    max-width: auto;
  }

  /*チャットのフィールド*/
  #field {
    width: 100%;
    height: calc(100vh - 160px);
    padding: 7px 0 14px;
    box-sizing: border-box;
    margin: 0 auto;
    background-color: #81AECF;
    /*横向きのスクロール禁止*/
    overflow-x: hidden;
    /*縦向きのスクロール許可*/
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    /*IE、Edgeでスクロールバーを非表示にする*/
    -ms-overflow-style: none;
  }

  /*Chrome、Safariでスクロールバーを非表示にする*/
  #field::-webkit-scrollbar {
    display: none;
  }

  #input-field {
    width: 100%;
    height: 45px;
    box-sizing: border-box;
    border-bottom: 1px solid #777;
    border-left: 1px solid #777;
    border-right: 1px solid #777;
    background-color: #FFF;
    margin: 0 auto;
  }

  /*入力する場所*/
  #chat-input {
    height: 25px;
    width: 80%;
    display: block;
    font-size: 14px;
    color: #000;
    box-sizing: border-box;
    border: 1px solid #777;
    border-radius: 4px;
    margin: auto 10px;
  }

  #chat-input:focus {
    border: 1.3px solid #8873FF;
    outline: 0;
  }

  /*送信ボタン*/
  #chat-button {
    cursor: pointer;
    height: 25px;
    width: 100px;
    font-size: 13px;
    background: #8873FF;
    color: white;
    display: block;
    /*デフォルトのボーダーを消す*/
    border: none;
    box-sizing: border-box;
    border-radius: 6.5px;
  }

  #chat-button:focus {
    outline: 0;
    background: #A899FF;
  }

  #chat-ul {
    /*ulのデフォルの隙間を消す*/
    padding: 0;
    list-style: none;
  }

  #chat-ul>li {
    display: block;
    width: 100%;
    margin-top: 7px;
    word-wrap: break-word;
  }

  #chat-ul>li>div {
    display: inline-block;
    box-sizing: border-box;
    color: #000;
    border-radius: 6px;
    min-height: 23px;
    max-width: 150px;
    padding: 7px 13px;
    font-size: 15px;
    line-height: 1.2em;
  }

  .chat-right {
    position: relative;
    margin-right: 100px;
    background: #A4E496;
    text-align: left;

    &:after {
      display: block;
      position: absolute;
      content: "";
      height: 10px;
      width: 10px;
      top: 50%;
      right: -15px;
      margin-right: 7px;
      transform: rotate(45deg) skew(-10deg, -10deg);
      transform-origin: 100% 0%;
      background: #A4E496;
    }
  }

  .chat-left {
    position: relative;
    margin-left: 100px;
    background: #FFF;

    &:before {
      position: absolute;
      content: "";
      height: 10px;
      width: 10px;
      display: block;
      top: 50%;
      margin-left: -15px;
      transform: rotate(45deg) skew(-10deg, -10deg);
      transform-origin: 100% 0%;
      background: #FFF;
    }
  }
</style>
