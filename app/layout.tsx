import { RouteTo } from "src/routing";
import { Dosis } from "next/font/google";
import { PT_Serif } from "next/font/google";
import Link from "next/link";
import { SearchForm } from "./SearchForm";
import { Metadata } from "next";
import "./global.css";

// https://nextjs.org/docs/basic-features/font-optimization
const mainHeadingFont = Dosis({ subsets: ["latin", "latin-ext"] });

// https://nextjs.org/docs/basic-features/font-optimization
const mainFont = PT_Serif({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "Ohlasy dění na Boskovicku",
  openGraph: {
    title: "Ohlasy dění na Boskovicku",
    description: "Internetové noviny pro Boskovice a okolí",
    locale: "cs-CZ",
    type: "website",
    images: [
      {
        url: "https://i.ohlasy.info/i/a5c62deb.jpg",
      },
    ],
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
        <script
          data-domain="ohlasy.info"
          src="https://plausible.io/js/script.outbound-links.js"
          defer
        />
      </head>
      <body>
        <div className={mainFont.className}>
          <NavBar />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}

const NavBar = () => {
  return (
    <nav className="navbar navbar-default">
      <div className="container">
        <h1 className={mainHeadingFont.className}>
          <Link href={RouteTo.homePage}>
            Ohlasy <small>dění na Boskovicku</small>
          </Link>
        </h1>
      </div>
    </nav>
  );
};

const Footer = () => (
  <footer className="text-muted">
    <div className="container">
      <div className="row">
        <div className="col-md-8">
          <ul className="list-unstyled">
            <li>
              <em>
                Ohlasy, noviny{" "}
                <span className="nobreak">pro Boskovice a okolí</span>
              </em>
            </li>
            <li>
              vydává <Link href={RouteTo.companyInfo}>spolek šílenců</Link>,{" "}
              <span className="nobreak">
                protože kdo jiný by dneska dělal noviny
              </span>
            </li>
            <li>nepoužíváme žádné cookies, respektujeme vaše soukromí</li>
            <li>
              <Link href={RouteTo.Facebook}>Facebook</Link> /{" "}
              <Link href={RouteTo.Mastodon}>Mastodon</Link> /{" "}
              <Link href={RouteTo.YouTube}>YouTube</Link> /{" "}
              <Link href={RouteTo.Instagram}>Instagram</Link> /{" "}
              <Link href={RouteTo.Spotify}>Spotify</Link> /{" "}
              <Link href={RouteTo.newsletter}>Newsletter</Link>
            </li>
            <li>
              <Link href={RouteTo.adsInfo}>Inzerce</Link> /{" "}
              <Link href={RouteTo.archive}>Archiv článků</Link> /{" "}
              <Link href={RouteTo.forum}>Diskuzní fórum</Link>
            </li>
            <li>
              <a href="mailto:ohlasy@ohlasy.info">ohlasy@ohlasy.info</a>
            </li>
            <li>+420 608 763 954</li>
            <li>
              <Link href={RouteTo.Vercel} className="powered-by">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/vercel.svg" alt="Powered by Vercel" />
              </Link>
            </li>
          </ul>
        </div>
        <div className="col-md-4">
          <SearchForm />
        </div>
      </div>
    </div>
  </footer>
);
