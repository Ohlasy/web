"use client";

import { Fragment, useState } from "react";
import { useNewsletterSubscription } from "@/src/hooks/newsletter";

export const NewsletterBox = () => {
  const [email, setEmail] = useState("");
  const { state, subscribe } = useNewsletterSubscription();
  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    subscribe(email, true);
  };
  return (
    <div className="flex flex-col gap-2">
      <p className="text-base uppercase">Newsletter</p>
      {state === "idle" && (
        <Fragment>
          <form onSubmit={handleSubmit} className="flex flex-wrap gap-3">
            <input
              type="email"
              className="flex-auto border border-silver px-2 py-2 text-base bg-white"
              autoCapitalize="none"
              placeholder="váš@email.cz"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="submit"
              className="flex-none btn-primary text-sm"
              value="Přihlásit"
              disabled={email === ""}
              onClick={handleSubmit}
            />
          </form>
          <p className="text-base">
            Nechte nám na sebe e‑mail a my vám jednou měsíčně pošleme shrnutí
            toho, co se v regionu událo. Na předchozí vydání newsletteru se{" "}
            <a href="https://newsletter.ohlasy.info" className="typo-link">
              můžete podívat tady
            </a>
            . Odběr můžete kdykoliv snadno zrušit.
          </p>
        </Fragment>
      )}
      {state === "subscribing" && <p>Malý moment…</p>}
      {state === "subscribed" && (
        <p>
          Úspěšně odesláno! 🎉 Děkujeme za váš zájem, newsletter dostanete
          mailem poprvé začátkem příštího měsíce.
        </p>
      )}
      {state === "failed" && (
        <p>
          Něco se pokazilo 😞 Zkuste prosím obnovit stránku a zadat mail ještě
          jednou. A kdyby to nepomohlo, napište nám prosím na{" "}
          <a href="mailto:ohlasy@ohlasy.info" className="typo-link">
            ohlasy@ohlasy.info
          </a>
          , chybu opravíme. Díky!
        </p>
      )}
    </div>
  );
};
