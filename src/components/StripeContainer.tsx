import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import React, { FC } from "react";

// Replace with your publishable key
// https://dashboard.stripe.com/apikeys
const STRIPE_PUBLISHABLE_KEY =
  "pk_test_51ICmUpGRaO6xlSVQrjpI9cXRSiOfvQRNzYhtFNGvLVU5Rt7LEoJQ4spa4cMP7phrzZnLL2EXH1WcJhC0Xca9feyi00u3x2YB45";

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

type Props = { children: React.ReactNode };

const StripeContainer: FC<Props> = (props) => {
  return <Elements stripe={stripePromise}>{props.children}</Elements>;
};

export default StripeContainer;
