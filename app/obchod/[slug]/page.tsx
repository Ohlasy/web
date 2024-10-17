import { Breadcrumbs } from "app/(shared)/Breadcrumbs";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Fragment } from "react";
import { getAllBooks } from "src/data-source/books";
import { RouteTo } from "src/routing";

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
      <div className="flex flex-col gap-7">
        <div className="grid grid-cols-3 gap-7">
          {/* Cover Image */}
          <div className="relative aspect-[2/3]">
            <Image
              src={book.coverImageUrl}
              className="object-cover"
              alt=""
              fill
            />
          </div>
          {/* Book Details */}
          <div className="col-span-2 flex flex-col gap-2">
            <div>
              <h1>{book.title}</h1>
              <h2>{book.subtitle}</h2>
            </div>
            <p>
              {book.authors}; {book.publishYear}
            </p>
            <p>{book.description}</p>
            {/* Actions */}
            <div className="mt-4 flex flex-row gap-4">
              <button className="btn-primary">Objednat</button>
              <Link href={RouteTo.shop} className="btn-inverted">
                Zpátky na seznam titulů
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
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
