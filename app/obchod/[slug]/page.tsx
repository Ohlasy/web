import { notFound } from "next/navigation";
import { getAllBooks } from "src/data-source/books";

type Params = {
  slug: string;
};

type Props = {
  params: Params;
};

export default async function Page({ params }: Props) {
  const { slug } = params;
  const books = await getAllBooks();
  const book = books.find((b) => b.slug === slug);
  if (!book) {
    notFound();
  }
  return (
    <div>
      <h1>{book.title}</h1>
      <h2>
        {book.subtitle} ({book.publishYear})
      </h2>
    </div>
  );
}

export async function generateStaticParams(): Promise<Params[]> {
  const books = await getAllBooks();
  return books.map(({ slug }) => ({ slug }));
}
