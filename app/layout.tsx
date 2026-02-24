import type { Metadata } from "next";
import { PT_Serif } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { RouteTo, siteUrl } from "src/routing";
import { NewsletterBox } from "./newsletter/NewsletterBox";
import { SearchForm } from "./SearchForm";
import "./global.css";

// https://nextjs.org/docs/basic-features/font-optimization
const mainFont = PT_Serif({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "Ohlasy dění na Boskovicku",
  metadataBase: new URL(siteUrl),
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
        <meta name="theme-color" content="#945200" />
        <link rel="shortcut icon" type="image/png" href="/favicon.png" />
        <link rel="me" href={RouteTo.Mastodon} />
        <link
          rel="alternate"
          type="application/rss+xml"
          href={RouteTo.articleFeed}
        />
        <script
          data-domain="ohlasy.info"
          src="https://plausible.io/js/script.tagged-events.outbound-links.js"
          defer
        />
      </head>
      <body>
        <div className={mainFont.className}>
          <NavBar />
          <div className="max-w-6xl m-auto px-5 md:px-7">{children}</div>
          <Footer />
        </div>
      </body>
    </html>
  );
}

const NavBar = () => {
  return (
    <nav className="mb-4 md:mb-6 bg-light-gray py-3 border-silver border-b">
      <div className="max-w-6xl m-auto px-3 md:px-7 overflow-hidden text-2xl lg:text-[42px] uppercase">
        <div>
          <Link
            href={RouteTo.homePage}
            className="flex gap-3 lg:gap-4 items-center max-md:justify-center"
          >
            <h1 className="font-semibold mr-1 typo-link">Ohlasy</h1>
            <div className="relative w-6 lg:w-10 aspect-square flex-none max-md:order-first">
              <Image src="/favicon.png" sizes="40px" alt="" fill priority />
            </div>
            <div className="hidden md:block text-[#666] whitespace-nowrap">
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
  <footer className="mt-10 bg-light-gray border-t border-silver py-10">
    <div className="max-w-6xl px-7 m-auto grid md:grid-cols-3 gap-7">
      <div className="grid grid-cols-1 gap-2 max-md:order-3">
        <SiteName />
        <p>
          <a href="mailto:ohlasy@ohlasy.info" className="typo-link">
            ohlasy@ohlasy.info
          </a>
          <br />
          +420 608 763 954
        </p>
        <p className="text-balance">
          Vydává{" "}
          <Link href={RouteTo.about} className="typo-link">
            spolek šílenců
          </Link>
          , protože kdo jiný by dneska dělal noviny.
        </p>
        <p>Nepoužíváme žádné cookies, respektujeme vaše soukromí.</p>
        <p>
          <Link href={RouteTo.adsInfo} className="typo-link">
            Chcete u nás inzerovat?
          </Link>
        </p>
      </div>
      <div className="max-md:order-2 flex flex-col gap-3">
        <div>
          <p>co ještě děláme</p>
          <LinkList
            links={[
              [RouteTo.store, "knihy"],
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
        <div className="flex flex-col gap-7">
          <SearchForm />
          <NewsletterBox />
        </div>
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
    <h1 className="font-semibold mr-1 typo-link">Ohlasy</h1>
  </Link>
);

const LinkList = ({ links }: { links: string[][] }) => (
  <ul className="leading-relaxed">
    {links.map(([url, label]) => (
      <li key={label}>
        <Link href={url} className="typo-link">
          {label}
        </Link>
      </li>
    ))}
  </ul>
);
