"use client";

import Plausible from "plausible-tracker";
import { useState } from "react";

const { trackEvent } = Plausible({ domain: "ohlasy.info" });

export const SearchForm = () => {
  const [query, setQuery] = useState("");
  const handleSubmit = (event: React.SyntheticEvent) => {
    trackEvent("Site Search", {
      props: { query },
      // Only navigate away after the event is logged
      // to make sure we don’t interrupt it.
      callback: () => {
        const localizedQuery = `${query} site:ohlasy.info`;
        window.location.href =
          "https://www.google.cz/search?" +
          new URLSearchParams({ q: localizedQuery });
      },
    });
    event.preventDefault();
  };
  return (
    <div className="flex flex-col gap-2">
      <p className="text-base uppercase">Vyhledávání</p>
      <form onSubmit={handleSubmit} className="flex flex-wrap gap-3">
        <input
          type="text"
          className="flex-auto border-[1px] border-silver px-2 py-2 text-base"
          autoCapitalize="none"
          placeholder="co vás zajímá?"
          onChange={(e) => setQuery(e.target.value)}
          required
        />
        <input
          type="submit"
          className="flex-none btn-primary text-sm"
          value="Hledat"
          disabled={query === ""}
          onClick={handleSubmit}
        />
      </form>
    </div>
  );
};
