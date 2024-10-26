import { Breadcrumbs } from "app/(shared)/Breadcrumbs";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Fragment } from "react";
import { getAllBooks } from "src/data-source/books";
import { RouteTo } from "src/routing";
import { BookDetails } from "./BookDetail";
import Image from "next/image";
import { placeOrder } from "./actions";

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
    <Fragment>
      <Breadcrumbs
        parentItems={[{ title: "Obchod", path: RouteTo.shop }]}
        currentItemTitle={book.title}
      />
      <div className="flex flex-col md:flex-row gap-7">
        <div>
          <div className="relative aspect-[2/3] w-full md:w-[350px] shrink-0">
            <Image
              src={book.coverImageUrl}
              className="object-cover"
              alt=""
              fill
            />
          </div>
        </div>
        <BookDetails book={book} placeOrderAction={placeOrder} />
      </div>
    </Fragment>
  );
}

//
// Data Generation
//

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

//
// Helpers
//

const getBookWithSlug = (slug: string) =>
  getAllBooks().then((books) => books.find((b) => b.slug === slug));
