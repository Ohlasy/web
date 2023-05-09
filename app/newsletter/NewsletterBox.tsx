"use client";

import { Fragment, useState } from "react";
import Plausible from "plausible-tracker";

const { trackEvent } = Plausible({ domain: "ohlasy.info" });

type Model = {
  state: "idle" | "submitting" | "succeeded" | "failed";
  email: string;
};

export const NewsletterBox = () => {
  const [model, setModel] = useState<Model>({ state: "idle", email: "" });
  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setModel({ ...model, state: "submitting" });
    trackEvent("Newsletter Subscribe");
    const success = await subscribeToNewsletter(model.email);
    setModel({ ...model, state: success ? "succeeded" : "failed" });
  };
  return (
    <div className="flex flex-col gap-2">
      <p className="text-base uppercase">Newsletter</p>
      {model.state === "idle" && (
        <Fragment>
          <form onSubmit={handleSubmit} className="flex flex-wrap gap-2">
            <input
              type="email"
              className="flex-auto border-[1px] border-silver px-2 py-2 text-base"
              autoCapitalize="none"
              placeholder="váš@email.cz"
              onChange={(e) => setModel({ ...model, email: e.target.value })}
            />
            <input
              type="submit"
              className="flex-none px-4 py-2 cursor-pointer text-base text-center bg-brown text-white rounded"
              value="přihlásit"
              onClick={handleSubmit}
            />
          </form>
          <p className="text-base">
            Nechte nám na sebe e‑mail a my vám jednou měsíčně pošleme shrnutí
            toho, co se v regionu událo. Na předchozí vydání newsletteru se{" "}
            <a href="https://newsletter.ohlasy.info">můžete podívat tady</a>.
            Odběr můžete kdykoliv snadno zrušit.
          </p>
        </Fragment>
      )}
      {model.state === "submitting" && <p>Malý moment…</p>}
      {model.state === "succeeded" && (
        <p>
          Úspěšně odesláno! 🎉 Děkujeme za váš zájem, newsletter dostanete
          mailem poprvé začátkem příštího měsíce.
        </p>
      )}
      {model.state === "failed" && (
        <p>
          Něco se pokazilo 😞 Zkuste prosím obnovit stránku a zadat mail ještě
          jednou. A kdyby to nepomohlo, napište nám prosím na{" "}
          <a href="mailto:ohlasy@ohlasy.info">ohlasy@ohlasy.info</a>, chybu
          opravíme. Díky!
        </p>
      )}
    </div>
  );
};

const subscribeToNewsletter = async (email: string) =>
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
    .catch((e) => false);
