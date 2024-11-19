"use client";

import { useState } from "react";
import { Book } from "src/data-source/books";
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

      {showOrder && (
        <div>
          <hr className="text-gray mt-4 mb-7" />
          <OrderForm
            itemId={book.databaseId}
            onCancel={() => setShowOrder(false)}
          />
        </div>
      )}

      {!showOrder && (
        <div className="mt-2">
          <ShowOrderButton />
        </div>
      )}
    </div>
  );
};
