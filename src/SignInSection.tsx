import { useEffect, useState } from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
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

firebase.initializeApp(firebaseConfig);

// Configure FirebaseUI.
const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: "popup",
  // We will display Google and Facebook as auth providers.
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
  ],
  callbacks: {
    // Avoid redirects after sign-in.
    signInSuccessWithAuthResult: () => false,
  },
};

function SignInSection() {
  const [isSignedIn, setIsSignedIn] = useState(false); // Local signed-in state.

  // Listen to the Firebase Auth state and set the local state.
  useEffect(() => {
    const unregisterAuthObserver = firebase
      .auth()
      .onAuthStateChanged((user) => {
        setIsSignedIn(!!user);
      });
    return () => unregisterAuthObserver(); // Make sure we un-register Firebase observers when the component unmounts.
  }, []);

  if (!isSignedIn) {
    return (
      <section>
        <p>Please sign-in:</p>
        <StyledFirebaseAuth
          uiConfig={uiConfig}
          firebaseAuth={firebase.auth()}
        />
      </section>
    );
  }
  return (
    <section>
      <p>
        Welcome {firebase?.auth()?.currentUser?.displayName}! You are now
        signed-in!
      </p>
      <a onClick={() => firebase.auth().signOut()}>Sign-out</a>
    </section>
  );
}

export default SignInSection;
