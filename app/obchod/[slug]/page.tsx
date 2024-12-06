import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllBooks } from "src/data-source/books";
import { BookDetails } from "./BookDetail";
import Image from "next/image";
import { getResizedImageUrl } from "src/utils";

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
    <div className="flex flex-col md:flex-row gap-7">
      <div>
        <div className="relative aspect-square md:aspect-[2/3] w-full md:w-[350px] shrink-0">
          <Image
            src={book.photoPortrait}
            className="absolute object-cover object-top bg-gray max-md:hidden"
            sizes="350px"
            alt=""
            fill
          />
          <Image
            src={book.photoLandscape}
            className="absolute object-cover object-top bg-gray md:hidden"
            sizes="100vw"
            alt=""
            fill
          />
        </div>
      </div>
      <BookDetails book={book} />
    </div>
  );
}

//
// Data Generation
//

// Revalidate this page every 5 minutes
export const revalidate = 300;

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
      images: getResizedImageUrl(book.photoLandscape, 1920),
    },
  };
}

//
// Helpers
//

const getBookWithSlug = (slug: string) =>
  getAllBooks().then((books) => books.find((b) => b.slug === slug));
