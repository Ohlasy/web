"use client";

import { useState } from "react";
import { Button } from "@/components/Button";
import { useNewsletterSubscription } from "@/src/hooks/newsletter";

export const SignUpForm = () => {
  const [email, setEmail] = useState("");
  const { state, subscribe } = useNewsletterSubscription();
  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    subscribe({ email, context: "volby" });
  };

  return (
    <div className="rounded-lg bg-plum text-white p-6 flex flex-col gap-6">
      <p>
        Už se to chystá! Stavíme pro vás natáčecí studio a přineseme vám
        videorozhovory s lídry a lídryněmi všech kandidátek. Můžete se na ně
        těšit v první polovině září. Chcete dát vědět, až budou venku? Nechte
        nám sebe e-mail!
      </p>

      <form onSubmit={handleSubmit} className="flex flex-wrap gap-3 text-black">
        <input
          type="email"
          className="w-full border border-silver px-2 py-2 text-base bg-white"
          autoCapitalize="none"
          placeholder="váš@email.cz"
          disabled={state === "subscribing" || state === "subscribed"}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button
          type="submit"
          text={state === "subscribing" ? "Moment…" : "Přihlásit"}
          disabled={
            email === "" || state === "subscribing" || state === "subscribed"
          }
          onClick={handleSubmit}
          stretch="always"
        />
      </form>

      {state === "subscribed" && <p>Díky! Ozveme se.</p>}
      {state === "failed" && <p>Něco nevyšlo, zkuste to znovu?</p>}
    </div>
  );
};
