import Image from "next/image";
import Link from "next/link";
import { Book, getAllBooks, sortByYear } from "src/data-source/books";
import { RouteTo } from "src/routing";

async function Page() {
  const books = await getAllBooks();
  return (
    <div className="flex flex-col gap-7">
      {books.sort(sortByYear).map((book) => (
        <BookBox key={book.slug} book={book} />
      ))}
    </div>
  );
}

const BookBox = ({ book }: { book: Book }) => (
  <div className="flex flex-col md:flex-row gap-7">
    <div className="w-[350px] aspect-[2/3] bg-gray shrink-0 relative max-md:hidden">
      <Image
        src={book.photoPortrait}
        className="object-cover"
        sizes="350px"
        alt=""
        fill
      />
    </div>
    <div className="w-full aspect-[3/2] bg-gray shrink-0 relative md:hidden">
      <Image
        src={book.photoLandscape}
        className="object-cover"
        sizes="100vw"
        alt=""
        fill
      />
    </div>
    <div>
      <h2 className="text-4xl leading-tight font-bold text-balance mb-2">
        {book.title}
      </h2>
      <p className="max-w-prose">{book.description}</p>
      <div className="my-7">
        <Link
          className="inline-block max-sm:w-full btn-primary"
          href={RouteTo.book(book)}
        >
          Zobrazit detaily
        </Link>
      </div>
    </div>
  </div>
);

export default Page;
