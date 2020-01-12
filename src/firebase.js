import * as firebase from "firebase";

const settings = {};

const config = {
  //production
  apiKey: "AIzaSyAh4O2rnu6ZvfLUv2vgRxMj2j6rU0ijyr0",
  authDomain: "pocketkpi1.firebaseapp.com",
  databaseURL: "https://pocketkpi1.firebaseio.com",
  projectId: "pocketkpi1",
  storageBucket: "pocketkpi1.appspot.com",
  messagingSenderId: "311370214498",
  appId: "1:311370214498:web:7ed5b392c6b66a038eb53b"

  //test A
  /*
  apiKey: "AIzaSyB58--M-ICMWo2CG655oEVnyi3XxbCVx6w",
  authDomain: "annd-5bd9a.firebaseapp.com",
  databaseURL: "https://annd-5bd9a.firebaseio.com",
  projectId: "annd-5bd9a",
  storageBucket: "",
  messagingSenderId: "225355172366",
  appId: "1:225355172366:web:89a4b68732599d86"

  //test B
  apiKey: "AIzaSyDG_SrqYjxe27dHjiijUyWYZBbuf8Ir1o8",
  authDomain: "annd2-a5d1c-18522.firebaseapp.com",
  databaseURL: "https://annd2-a5d1c-18522.firebaseio.com",
  projectId: "annd2-a5d1c",
  storageBucket: "",
  messagingSenderId: "133088240840",
  appId: "1:133088240840:web:dec6272ac0d4b7bd"
  */
};
firebase.initializeApp(config);
firebase.firestore().settings(settings);

export default firebase;
