import Head from "next/head";
import Link from "next/link";
import { Route } from "src/routing";
import { Dosis } from "@next/font/google";
import Script from "next/script";

// https://nextjs.org/docs/basic-features/font-optimization
const mainHeadingFont = Dosis({ subsets: ["latin", "latin-ext"] });

export type LayoutProps = {
  title: string;
  description?: string;
  image?: string;
  children: React.ReactNode;
};

export const Layout: React.FC<LayoutProps> = ({
  title,
  description = "Internetové noviny pro Boskovice a okolí",
  image = "https://i.ohlasy.info/i/a5c62deb.jpg",
  children,
}) => {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:image" content={image} />
        <link rel="shortcut icon" type="image/png" href="/favicon.png" />
        <link rel="me" href={Route.toMastodon} />
      </Head>
      <Script
        data-domain="ohlasy.info"
        src="https://plausible.io/js/script.outbound-links.js"
      />
      <NavBar />
      {children}
      <Footer />
    </>
  );
};

const NavBar = () => {
  return (
    <nav className="navbar navbar-default">
      <div className="container">
        <h1 className={mainHeadingFont.className}>
          <Link href={Route.toHomePage}>
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
              vydává <Link href={Route.toCompanyInfo}>spolek šílenců</Link>,{" "}
              <span className="nobreak">
                protože kdo jiný by dneska dělal noviny
              </span>
            </li>
            <li>nepoužíváme žádné cookies, respektujeme vaše soukromí</li>
            <li>
              <Link href={Route.toFacebook}>Facebook</Link> /{" "}
              <Link href={Route.toMastodon}>Mastodon</Link> /{" "}
              <Link href={Route.toYouTube}>YouTube</Link> /{" "}
              <Link href={Route.toInstagram}>Instagram</Link> /{" "}
              <Link href={Route.toSpotify}>Spotify</Link>
            </li>
            <li>
              <Link href={Route.toAdsInfo}>Inzerce</Link> /{" "}
              <Link href={Route.toArchive}>Archiv článků</Link> /{" "}
              <Link href={Route.toForum}>Diskuzní fórum</Link>
            </li>
            <li>
              <a href="mailto:ohlasy@ohlasy.info">ohlasy@ohlasy.info</a>
            </li>
            <li>+420 608 763 954</li>
            <li>
              <Link href={Route.toVercel} className="powered-by">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/vercel.svg" alt="Powered by Vercel" />
              </Link>
            </li>
          </ul>
        </div>
        <div className="col-md-4">{/*{% include search-form.html %}*/}</div>
      </div>
    </div>
  </footer>
);
