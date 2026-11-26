import Plausible from "plausible-tracker";
import { useState } from "react";

const { trackEvent } = Plausible({ domain: "ohlasy.info" });

export type SubscriptionProps = {
  /** Address to subscribe */
  email: string;
};

export function useNewsletterSubscription() {
  type State = "idle" | "subscribing" | "subscribed" | "failed";
  const [state, setState] = useState<State>("idle");

  async function subscribe({ email }: SubscriptionProps) {
    setState("subscribing");
    const success = await subscribeToNewsletter(email);
    if (success) {
      trackEvent("Newsletter Subscribe");
      setState("subscribed");
    } else {
      setState("failed");
    }
  }

  return { state, subscribe };
}

const subscribeToNewsletter = async (email: string) =>
  await fetch("https://api.ohlasy.info/newsletter/subscribe", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  })
    .then((response) => response.ok)
    .catch((error) => {
      console.error(error);
      return false;
    });
