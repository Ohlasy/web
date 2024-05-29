import { Metadata } from "next";
import Image from "next/image";
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
    <div className="flex flex-col gap-7">
      <div className="grid grid-cols-3 gap-7">
        <div className="relative aspect-[2/3]">
          <Image
            src={book.coverImageUrl}
            className="object-cover"
            alt=""
            fill
          />
        </div>
        <div className="col-span-2 flex flex-col gap-2">
          <div>
            <h1>{book.title}</h1>
            <h2>{book.subtitle}</h2>
          </div>
          <p>
            {book.authors}; {book.publishYear}
          </p>
          <p>{book.description}</p>
        </div>
      </div>
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
