"use client";

import Link from "next/link";
import { useState } from "react";
import { Book } from "src/data-source/books";
import { RouteTo } from "src/routing";
import { OrderForm } from "./OrderForm";

type Props = {
  book: Book;
};

// TBD: Fix order button logic
export const BookDetails = ({ book }: Props) => {
  const [showOrder, setShowOrder] = useState(false);

  const ShowOrderButton = () => (
    <button className="btn-primary" onClick={() => setShowOrder(true)}>
      Objednat
    </button>
  );

  const CancelOrderButton = () => (
    <button className="btn-inverted" onClick={() => setShowOrder(false)}>
      Zrušit objednávku
    </button>
  );

  return (
    <div className="flex flex-col gap-7">
      {/* Book Info */}
      <div className="flex flex-col gap-4">
        <div>
          <h1>{book.title}</h1>
          <h2>{book.subtitle}</h2>
        </div>
        <p>
          {book.authors}; {book.publishYear}
        </p>
        <p>{book.description}</p>
      </div>

      {/* Actions */}
      <div className="flex flex-col md:flex-row gap-4">
        {showOrder ? <CancelOrderButton /> : <ShowOrderButton />}
        <Link href={RouteTo.shop} className="btn-inverted">
          Zpátky na seznam titulů
        </Link>
      </div>

      {/* Order Form */}
      {showOrder && (
        <div>
          <hr className="text-gray mb-7" />
          <OrderForm itemId={book.databaseId} />
        </div>
      )}
    </div>
  );
};
