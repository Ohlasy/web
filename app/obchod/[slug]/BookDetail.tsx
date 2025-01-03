"use client";

import { useState } from "react";
import { Book } from "src/data/books";
import { OrderForm } from "./OrderForm";

type Props = {
  book: Book;
};

export const BookDetails = ({ book }: Props) => {
  const [showOrder, setShowOrder] = useState(false);

  const priceFormatter = Intl.NumberFormat("cs-CZ", {
    style: "currency",
    currency: "CZK",
    maximumFractionDigits: 0,
  });

  const inStock = book.state === "v prodeji";

  const orderLabel = book.price
    ? `Koupit za ${priceFormatter.format(book.price)}`
    : "Koupit";

  const ShowOrderButton = () => (
    <button
      className="btn-primary max-sm:w-full"
      onClick={() => setShowOrder(true)}
    >
      {orderLabel}
    </button>
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-4xl leading-tight font-bold text-balance">
          {book.title}
        </h1>
        <h2 className="italic">{book.subtitle}</h2>
        <p>
          {book.authors}; {book.publishYear}
        </p>
      </div>

      <p>{book.description}</p>

      {inStock && showOrder && (
        <div>
          <hr className="text-gray mt-4 mb-7" />
          <OrderForm
            itemId={book.databaseId}
            onCancel={() => setShowOrder(false)}
          />
        </div>
      )}

      {inStock && !showOrder && (
        <div className="mt-2">
          <ShowOrderButton />
        </div>
      )}

      {!inStock && (
        <div className="mt-2">
          <button className="btn-primary" disabled>
            Kniha je vyprodaná
          </button>
        </div>
      )}
    </div>
  );
};
