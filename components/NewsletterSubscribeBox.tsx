"use client";

import { useState } from "react";
import { useNewsletterSubscription } from "@/src/hooks/newsletter";
import { FullWidthCard } from "./FullWidthCard";

export const NewsletterSubscribeBox = () => {
  const [email, setEmail] = useState("");
  const { state, subscribe } = useNewsletterSubscription();
  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    subscribe(email, true);
  };
  return (
    <FullWidthCard>
      <div className="text-white text-center max-w-100 m-auto">
        <p>To nejdůležitější z Boskovicka ve vaší schránce</p>
        {state === "idle" && (
          <p className="text-sm mb-6!">
            Čtete webové vydání našeho newsletteru, který posíláme pravidelně
            jednou měsíčně e-mailem. Pokud ho chcete též dostávat přímo do
            schránky, nechte nám na sebe e-mailovou adresu.
          </p>
        )}
        {state === "idle" && (
          <form
            onSubmit={handleSubmit}
            className="flex flex-wrap gap-3 text-black pb-3"
          >
            <input
              type="email"
              className="w-full border border-silver px-2 py-2 text-base bg-white"
              autoCapitalize="none"
              placeholder="váš@email.cz"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="submit"
              className="w-full btn-primary"
              value="Přihlásit"
              disabled={email === ""}
              onClick={handleSubmit}
            />
          </form>
        )}
        {state === "subscribing" && <Spinner />}
        {state === "subscribed" && <SuccessMsg />}
        {state === "failed" && <ErrorMsg />}
      </div>
    </FullWidthCard>
  );
};

const Spinner = () => <p className="text-sm">Malý moment…</p>;

const SuccessMsg = () => (
  <p className="text-sm max-w-prose">
    Děkujeme za váš zájem! Newsletter dostanete mailem poprvé začátkem příštího
    měsíce.
  </p>
);

const ErrorMsg = () => (
  <p className="text-sm">
    Něco se pokazilo 😞 Zkuste prosím obnovit stránku a zadat mail ještě jednou.
    A kdyby to nepomohlo, napište nám prosím, chybu opravíme. Díky!
  </p>
);
