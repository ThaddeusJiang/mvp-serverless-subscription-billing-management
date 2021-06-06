import firebase from "firebase";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBP_vIQVx7dxjfkLzKD5_pJekdIFpltQhk",
  authDomain: "mvp-serverless-billing-website.firebaseapp.com",
  databaseURL:
    "https://mvp-serverless-billing-website-default-rtdb.firebaseio.com",
  projectId: "mvp-serverless-billing-website",
  storageBucket: "mvp-serverless-billing-website.appspot.com",
  messagingSenderId: "1059494009800",
  appId: "1:1059494009800:web:b0b720851fa03078443efd",
  measurementId: "G-QT4ZPX5G6Q",
};

export const firebaseApp = firebase.initializeApp(firebaseConfig);

export default firebase;
