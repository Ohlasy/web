import { RouteTo } from "src/routing";
import { PT_Serif } from "next/font/google";
import Link from "next/link";
import { SearchForm } from "./SearchForm";
import { Metadata } from "next";
import "./global.css";
import Image from "next/image";
import Balancer from "react-wrap-balancer";

// https://nextjs.org/docs/basic-features/font-optimization
const mainFont = PT_Serif({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "Ohlasy dění na Boskovicku",
  description: "Internetové noviny pro Boskovice a okolí",
  openGraph: {
    title: "Ohlasy dění na Boskovicku",
    description: "Internetové noviny pro Boskovice a okolí",
    locale: "cs-CZ",
    type: "website",
    images: "https://i.ohlasy.info/i/a5c62deb.jpg",
  },
};

type Props = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <html lang="cs">
      <head>
        <meta charSet="utf-8" />
        <link rel="shortcut icon" type="image/png" href="/favicon.png" />
        <link rel="me" href={RouteTo.Mastodon} />
        <link
          rel="alternate"
          type="application/rss+xml"
          href={RouteTo.articleFeed}
        />
        <script
          data-domain="ohlasy.info"
          src="https://plausible.io/js/script.outbound-links.js"
          defer
        />
      </head>
      <body>
        <div className={mainFont.className}>
          <NavBar />
          <div className="max-w-6xl m-auto px-3 md:px-7">{children}</div>
          <Footer />
        </div>
      </body>
    </html>
  );
}

const NavBar = () => {
  return (
    <nav className="mb-3 md:mb-6 bg-lightGray py-3 lg:py-5 border-silver border-b-[1px]">
      <div className="max-w-6xl m-auto px-7 overflow-hidden text-2xl lg:text-[42px] uppercase">
        <div>
          <Link
            href={RouteTo.homePage}
            className="flex gap-3 lg:gap-4 items-center"
          >
            <h1 className="font-semibold mr-1">Ohlasy</h1>
            <div className="relative w-6 lg:w-10 aspect-square flex-none">
              <Image src="/favicon.png" sizes="40px" alt="" fill />
            </div>
            <div className="text-[#666] whitespace-nowrap">
              dění na Boskovicku
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
};

//
// Footer
//

const Footer = () => (
  <footer className="mt-10 bg-lightGray border-t-[1px] border-silver py-10">
    <div className="max-w-6xl px-7 m-auto grid md:grid-cols-3 gap-7">
      <div className="grid grid-cols-1 gap-2 max-md:order-3">
        <SiteName />
        <p>
          <a href="mailto:ohlasy@ohlasy.info">ohlasy@ohlasy.info</a>
          <br />
          +420 608 763 954
        </p>
        <p>
          <Balancer>
            Vydává <Link href={RouteTo.companyInfo}>spolek šílenců</Link>,
            protože kdo jiný by dneska dělal noviny.
          </Balancer>
        </p>
        <p>Nepoužíváme žádné cookies, respektujeme vaše soukromí.</p>
        <p>
          <Link href={RouteTo.adsInfo}>Chcete u nás inzerovat?</Link>
        </p>
        <p className="mt-7">
          <Link
            href={RouteTo.Vercel}
            style={{
              display: "inline-block",
              marginTop: "30px",
              cursor: "pointer",
            }}
          >
            <Image
              src="/vercel.svg"
              alt="Powered by Vercel"
              width={188}
              height={39}
            />
          </Link>
        </p>
      </div>
      <div className="max-md:order-2 flex flex-col gap-3">
        <div>
          <p>co ještě děláme</p>
          <LinkList
            links={[
              [RouteTo.archive, "archiv článků"],
              [RouteTo.forum, "diskuzní fórum"],
              [RouteTo.newsletter, "newsletter"],
              [RouteTo.podcasts, "podcast"],
            ]}
          />
        </div>
        <div>
          <p>kde nás najdete</p>
          <LinkList
            links={[
              [RouteTo.Facebook, "Facebook"],
              [RouteTo.Mastodon, "Mastodon"],
              [RouteTo.YouTube, "YouTube"],
              [RouteTo.Instagram, "Instagram"],
              [RouteTo.Spotify, "Spotify"],
            ]}
          />
        </div>
      </div>
      <div className="max-md:order-1">
        <SearchForm />
      </div>
    </div>
  </footer>
);

const SiteName = () => (
  <Link
    href={RouteTo.homePage}
    className="flex gap-2 items-center uppercase mb-2"
  >
    <div className="relative w-6 aspect-square flex-none">
      <Image src="/favicon.png" sizes="24px" alt="" fill />
    </div>
    <h1 className="font-semibold mr-1">Ohlasy</h1>
  </Link>
);

const LinkList = ({ links }: { links: string[][] }) => (
  <ul className="leading-relaxed">
    {links.map(([url, label]) => (
      <li key={label}>
        <Link href={url}>{label}</Link>
      </li>
    ))}
  </ul>
);

//
// Helpers
//

const SizeClassIndicator = () => (
  <div className="fixed top-3 right-3 bg-silver text-offBlack text-xs p-2 rounded-full z-[1000]">
    <span className="block md:hidden">SM</span>
    <span className="hidden md:block lg:hidden">MD</span>
    <span className="hidden lg:block xl:hidden">LG</span>
    <span className="hidden xl:block">XL</span>
  </div>
);
