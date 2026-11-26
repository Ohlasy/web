"use client";

import Plausible from "plausible-tracker";
import { useState } from "react";
import { Button } from "@/components/Button";

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
          className="flex-auto border border-silver px-2 py-2 text-base bg-white"
          autoCapitalize="none"
          placeholder="co vás zajímá?"
          onChange={(e) => setQuery(e.target.value)}
          required
        />
        <Button
          type="submit"
          text="Hledat"
          size="small"
          disabled={query === ""}
          onClick={handleSubmit}
        />
      </form>
    </div>
  );
};
