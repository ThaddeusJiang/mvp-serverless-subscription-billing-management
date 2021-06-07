import { useStripe } from "@stripe/react-stripe-js";
import { FC, useEffect, useState } from "react";
import firebase, { firebaseApp } from "../firebase";

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
    <div className="relative py-16 bg-white">
      <div
        className="hidden absolute top-0 inset-x-0 h-1/2 bg-gray-50 lg:block"
        aria-hidden="true"
      />
      <div className="max-w-7xl mx-auto bg-indigo-600 lg:bg-transparent lg:px-8">
        <div className="lg:grid lg:grid-cols-12">
          <div className="relative z-10 lg:col-start-1 lg:row-start-1 lg:col-span-4 lg:py-16 lg:bg-transparent">
            <div
              className="absolute inset-x-0 h-1/2 bg-gray-50 lg:hidden"
              aria-hidden="true"
            />
            <div className="max-w-md mx-auto px-4 sm:max-w-3xl sm:px-6 lg:max-w-none lg:p-0">
              <div className="aspect-w-10 aspect-h-6 sm:aspect-w-2 sm:aspect-h-1 lg:aspect-w-1">
                <img
                  className="object-cover object-center rounded-3xl shadow-2xl"
                  src="https://images.unsplash.com/photo-1507207611509-ec012433ff52?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=934&q=80"
                  alt=""
                />
              </div>
            </div>
          </div>

          <div className="relative bg-indigo-600 lg:col-start-3 lg:row-start-1 lg:col-span-10 lg:rounded-3xl lg:grid lg:grid-cols-10 lg:items-center">
            <div
              className="hidden absolute inset-0 overflow-hidden rounded-3xl lg:block"
              aria-hidden="true"
            >
              <svg
                className="absolute bottom-full left-full transform translate-y-1/3 -translate-x-2/3 xl:bottom-auto xl:top-0 xl:translate-y-0"
                width={404}
                height={384}
                fill="none"
                viewBox="0 0 404 384"
                aria-hidden="true"
              >
                <defs>
                  <pattern
                    id="64e643ad-2176-4f86-b3d7-f2c5da3b6a6d"
                    x={0}
                    y={0}
                    width={20}
                    height={20}
                    patternUnits="userSpaceOnUse"
                  >
                    <rect
                      x={0}
                      y={0}
                      width={4}
                      height={4}
                      className="text-indigo-500"
                      fill="currentColor"
                    />
                  </pattern>
                </defs>
                <rect
                  width={404}
                  height={384}
                  fill="url(#64e643ad-2176-4f86-b3d7-f2c5da3b6a6d)"
                />
              </svg>
              <svg
                className="absolute top-full transform -translate-y-1/3 -translate-x-1/3 xl:-translate-y-1/2"
                width={404}
                height={384}
                fill="none"
                viewBox="0 0 404 384"
                aria-hidden="true"
              >
                <defs>
                  <pattern
                    id="64e643ad-2176-4f86-b3d7-f2c5da3b6a6d"
                    x={0}
                    y={0}
                    width={20}
                    height={20}
                    patternUnits="userSpaceOnUse"
                  >
                    <rect
                      x={0}
                      y={0}
                      width={4}
                      height={4}
                      className="text-indigo-500"
                      fill="currentColor"
                    />
                  </pattern>
                </defs>
                <rect
                  width={404}
                  height={384}
                  fill="url(#64e643ad-2176-4f86-b3d7-f2c5da3b6a6d)"
                />
              </svg>
            </div>
            {subscribed ? (
              <div className="relative max-w-md mx-auto py-12 px-4 space-y-6 sm:max-w-3xl sm:py-16 sm:px-6 lg:max-w-none lg:p-0 lg:col-start-4 lg:col-span-6">
                <h2
                  className="text-3xl font-extrabold text-white"
                  id="join-heading"
                >
                  You are a member.
                </h2>
                <p className="text-lg text-white">
                  Varius facilisi mauris sed sit. Non sed et duis dui leo,
                  vulputate id malesuada non. Cras aliquet purus dui laoreet
                  diam sed lacus, fames.
                </p>

                <button
                  className="block w-full py-3 px-5 text-center bg-white border border-transparent rounded-md shadow-md text-base font-medium text-indigo-700 hover:bg-gray-50 sm:inline-block sm:w-auto"
                  onClick={openCustomerPortal}
                >
                  Manage your subscription
                </button>
              </div>
            ) : (
              <div className="relative max-w-md mx-auto py-12 px-4 space-y-6 sm:max-w-3xl sm:py-16 sm:px-6 lg:max-w-none lg:p-0 lg:col-start-4 lg:col-span-6">
                <h2
                  className="text-3xl font-extrabold text-white"
                  id="join-heading"
                >
                  Join our club
                </h2>
                <p className="text-lg text-white">
                  Varius facilisi mauris sed sit. Non sed et duis dui leo,
                  vulputate id malesuada non. Cras aliquet purus dui laoreet
                  diam sed lacus, fames.
                </p>
                <button
                  className="block w-full py-3 px-5 text-center bg-white border border-transparent rounded-md shadow-md text-base font-medium text-indigo-700 hover:bg-gray-50 sm:inline-block sm:w-auto"
                  onClick={subscribe}
                >
                  Join
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StripeCheckout;
