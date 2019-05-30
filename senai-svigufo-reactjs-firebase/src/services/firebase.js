import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyDtn7D2iL_xzARjqvXqDKuR5SoKLrySAnY",
  authDomain: "svigufotardeariel.firebaseapp.com",
  databaseURL: "https://svigufotardeariel.firebaseio.com",
  projectId: "svigufotardeariel",
  storageBucket: "svigufotardeariel.appspot.com",
  messagingSenderId: "825880592131",
  appId: "1:825880592131:web:0a96040a168c6b67"
};

firebase.initializeApp(firebaseConfig);

export default firebase;
