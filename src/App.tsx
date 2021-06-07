import { useState } from "react";
import firebase from "./firebase";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Auth from "./components/Auth";
import StripeContainer from "./components/StripeContainer";
import StripeSubscribeManagement from "./components/StripeSubscribeManagement";
import Footer from "./components/Footer";

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
    <div>
      <section>
        <Hero />
      </section>

      <section>
        <Features />
      </section>

      <section>
        <Auth />
      </section>

      {userId && (
        <section>
          <StripeContainer>
            <StripeSubscribeManagement userId={userId} />
          </StripeContainer>
        </section>
      )}

      <Footer />
    </div>
  );
}

export default App;
