"use client";

import { useState } from "react";

export const SearchForm = () => {
  const [query, setQuery] = useState("");
  const handleSubmit = (event: any) => {
    const localizedQuery = `${query} site:ohlasy.info`;
    window.location.href =
      "https://www.google.cz/search?" +
      new URLSearchParams({ q: localizedQuery });
    event.preventDefault();
  };
  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-2">
      <input
        type="text"
        className="flex-auto border-[1px] border-silver px-2 py-2"
        placeholder="sportovní hala"
        onChange={(e) => setQuery(e.target.value)}
      />
      <input
        type="submit"
        className="flex-none w-[7ex] px-2 py-2 cursor-pointer text-center bg-brown text-white rounded"
        value="hledej"
        onClick={handleSubmit}
      />
    </form>
  );
};
