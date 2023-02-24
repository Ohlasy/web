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
    <form onSubmit={handleSubmit}>
      <div className="input-group input-group-md">
        <input
          type="text"
          className="query form-control"
          placeholder="klid duše"
          onChange={(e) => setQuery(e.target.value)}
          size={31}
        />
        <span className="input-group-btn">
          <input
            type="submit"
            className="btn btn-primary"
            value="hledej"
            onClick={handleSubmit}
          />
        </span>
      </div>
    </form>
  );
};
