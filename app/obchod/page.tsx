import Link from "next/link";
import { Book, getAllBooks, sortByYear } from "src/data-source/books";
import { RouteTo } from "src/routing";

export default async function Page() {
  const books = await getAllBooks();
  return (
    <div>
      <h1 className="mb-7">Obchůdek</h1>
      <div className="flex flex-col gap-7">
        {books.sort(sortByYear).map((book) => (
          <BookPreview key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
}

const BookPreview = ({ book }: { book: Book }) => (
  <div>
    <h2>{book.title}</h2>
    <h3>{book.subtitle}</h3>
    <Link href={RouteTo.book(book)}>zobrazit detail</Link>
  </div>
);
