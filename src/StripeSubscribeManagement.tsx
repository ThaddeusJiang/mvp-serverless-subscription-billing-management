import { useStripe } from "@stripe/react-stripe-js";
import { FC, useEffect, useState } from "react";
import firebase, { firebaseApp } from "./firebase";

const db = firebaseApp.firestore();

// Replace with your tax ids
// https://dashboard.stripe.com/tax-rates
const taxRates = ["txr_1IzD4hGRaO6xlSVQZXn2VeyN"];

// Replace with your cloud functions location
const functionLocation = "asia-northeast1";

type Props = {
  userId: string;
};

const StripeCheckout: FC<Props> = (props) => {
  const { userId } = props;
  const stripe = useStripe();

  const [subscribed, setSubscribed] = useState(false);

  const subscribe = async () => {
    const selectedPrice = {
      price: "price_1IzKIbGRaO6xlSVQdo1oAHgd",
      quantity: 1,
    };

    const checkoutSession = {
      collect_shipping_address: true,
      tax_rates: taxRates,
      allow_promotion_codes: true,
      line_items: [selectedPrice],
      success_url: window.location.origin,
      cancel_url: window.location.origin,
      metadata: {
        key: "value",
      },
      mode: "subscription",
    };

    const docRef = await db
      .collection("customers")
      .doc(userId)
      .collection("checkout_sessions")
      .add(checkoutSession);
    // Wait for the CheckoutSession to get attached by the extension
    docRef.onSnapshot((snap) => {
      const data = snap.data();
      if (data?.error) {
        // Show an error to your customer and then inspect your function logs.
        alert(`An error occured: ${data.error.message}`);
      }
      if (data?.sessionId) {
        // We have a session, let's redirect to Checkout
        stripe?.redirectToCheckout({ sessionId: data.sessionId });
      }
    });
  };

  const openCustomerPortal = async () => {
    // Call billing portal function
    const functionRef = firebase
      .app()
      .functions(functionLocation)
      .httpsCallable("ext-firestore-stripe-subscriptions-createPortalLink");
    const { data } = await functionRef({ returnUrl: window.location.origin });
    window.location.assign(data.url);
  };

  useEffect(() => {
    const getAllSubscriptions = async () => {
      const docRef = await db
        .collection("customers")
        .doc(userId)
        .collection("subscriptions")
        .where("status", "in", ["trialing", "active"]);

      docRef.onSnapshot((snapshot) => {
        if (snapshot.empty) {
          setSubscribed(false);
        } else {
          setSubscribed(true);
        }
      });
    };

    getAllSubscriptions();
  }, [userId]);

  return (
    <div>
      {subscribed ? (
        <button onClick={openCustomerPortal}>Open Customer Portal</button>
      ) : (
        <button onClick={subscribe}>Subscribe</button>
      )}
    </div>
  );
};

export default StripeCheckout;
