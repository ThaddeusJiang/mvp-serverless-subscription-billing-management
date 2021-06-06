import SignInSection from "./SignInSection";
import StripeContainer from "./StripeContainer";
import StripeSubscribeManagement from "./StripeSubscribeManagement";
import firebase from "./firebase";
import { useState } from "react";

function App() {
  const [userId, setUserId] = useState("");

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      setUserId(user.uid);
    } else {
      setUserId("");
    }
  });
  return (
    <div className="m-4 space-y-16">
      <section className="p-4 border rounded">
        <h1>Hi Friend, This is mvp-serverless-billing-website.</h1>
        <p>This is a MVP(minimum viable product)</p>
        <p>Features:</p>
        <p>sign up / sign in</p>
        <p>subscribe</p>
        <p>billing management</p>
      </section>

      {userId && (
        <section className="p-4 border rounded">
          <StripeContainer>
            <StripeSubscribeManagement userId={userId} />
          </StripeContainer>
        </section>
      )}

      <SignInSection />
    </div>
  );
}

export default App;
