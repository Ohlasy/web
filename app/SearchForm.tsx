"use client";

import { useState } from "react";
import Plausible from "plausible-tracker";

const { trackEvent } = Plausible({ domain: "ohlasy.info" });

export const SearchForm = () => {
  const [query, setQuery] = useState("");
  const handleSubmit = (event: any) => {
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
      <form onSubmit={handleSubmit} className="flex flex-wrap gap-2">
        <input
          type="text"
          className="flex-auto border-[1px] border-silver px-2 py-2"
          autoCapitalize="none"
          placeholder="sportovní hala"
          onChange={(e) => setQuery(e.target.value)}
          required
        />
        <input
          type="submit"
          className="flex-none w-[10ex] py-2 cursor-pointer text-base text-center bg-brown text-white rounded"
          value="hledej"
          onClick={handleSubmit}
        />
      </form>
    </div>
  );
};
