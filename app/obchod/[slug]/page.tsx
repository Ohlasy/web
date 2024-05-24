import { Metadata } from "next";
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
  const book = await getBookWithSlug(slug);
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params;
  const book = await getBookWithSlug(slug);
  if (!book) {
    return {};
  }
  return {
    title: book.title,
    description: book.description,
    openGraph: {
      title: book.title,
      description: book.description,
      images: book.coverImageUrl,
    },
  };
}

const getBookWithSlug = (slug: string) =>
  getAllBooks().then((books) => books.find((b) => b.slug === slug));
