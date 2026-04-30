import Plausible from "plausible-tracker";
import { useState } from "react";

const { trackEvent } = Plausible({ domain: "ohlasy.info" });

export function useNewsletterSubscription() {
  type State = "idle" | "subscribing" | "subscribed" | "failed";
  const [state, setState] = useState<State>("idle");
  async function subscribe(email: string, trackAnalyticsEvent: boolean) {
    setState("subscribing");
    const success = await subscribeToNewsletter(email);
    if (success) {
      if (trackAnalyticsEvent) {
        trackEvent("Newsletter Subscribe");
      }
      setState("subscribed");
    } else {
      setState("failed");
    }
  }
  return { state, subscribe };
}

export const subscribeToNewsletter = async (email: string) =>
  await fetch(`/newsletter/subscribe`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
    }),
  })
    .then((response) => response.ok)
    .catch((error) => {
      console.error(error);
      return false;
    });
