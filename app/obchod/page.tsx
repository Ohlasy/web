import { Breadcrumbs } from "app/(shared)/Breadcrumbs";
import Image from "next/image";
import Link from "next/link";
import { Book, getAllBooks, sortByYear } from "src/data-source/books";
import { RouteTo } from "src/routing";

export default async function Page() {
  const books = await getAllBooks();
  return (
    <div>
      <Breadcrumbs currentItemTitle="Obchod" />
      <div className="flex flex-col gap-12">
        {books.sort(sortByYear).map((book) => (
          <BookPreview key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
}

const BookPreview = ({ book }: { book: Book }) => (
  <div className="grid grid-cols-3 gap-7">
    <div className="relative w-full aspect-[2/3]">
      <Image src={book.coverImageUrl} className="object-cover" alt="" fill />
    </div>
    <div className="col-span-2 flex flex-col gap-7">
      <div>
        <h2>{book.title}</h2>
        <h3>{book.subtitle}</h3>
      </div>
      <p>{book.description}</p>
      <div>
        <Link href={RouteTo.book(book)} className="btn-primary">
          Zobrazit detaily
        </Link>
      </div>
    </div>
  </div>
);
