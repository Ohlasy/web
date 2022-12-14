import Head from "next/head";
import Link from "next/link";
import { Route } from "src/routing";
import { Dosis } from "@next/font/google";

// https://nextjs.org/docs/basic-features/font-optimization
const mainHeadingFont = Dosis({ subsets: ["latin", "latin-ext"] });

export type LayoutProps = {
  title: string;
  children: React.ReactNode;
};

export const Layout: React.FC<LayoutProps> = ({ title, children }) => {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <title>{title}</title>
        <link rel="shortcut icon" type="image/png" href="/favicon.png" />
        <link rel="me" href={Route.toMastodon} />
      </Head>
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
              <Link href={Route.toAdsInfo}>inzerce</Link> /{" "}
              <Link href={Route.toArchive}>archiv článků</Link> /{" "}
              <Link href={Route.toPodcast}>podcast</Link>
            </li>
            <li>
              <a href="mailto:ohlasy@ohlasy.info">ohlasy@ohlasy.info</a>
            </li>
            <li>+420 608 763 954</li>
            <li>
              <Link href={Route.toForum}>Diskuzní fórum</Link>
            </li>
            <li>
              <Link href={Route.toFacebook}>Facebook</Link>
            </li>
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
