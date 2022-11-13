import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyBs3SvQTp89p-zQwRKClWjJuSUOr6Ohg20",
  authDomain: "onlinedatingapp-9ab46.firebaseapp.com",
  projectId: "onlinedatingapp-9ab46",
  storageBucket: "onlinedatingapp-9ab46.appspot.com",
  messagingSenderId: "549305260076",
  appId: "1:549305260076:web:69d2b6832a48077c219989"
};

// Firebaseを初期化
const app = initializeApp(firebaseConfig);
// DBとの接続・ユーザー情報・Googleログイン認証
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const storage = getStorage(app);

// Firebaseとの接続情報をエクスポート（各コンポーネントで利用）
export { auth, provider, db, storage };
