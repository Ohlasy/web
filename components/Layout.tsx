import Head from "next/head";
import Link from "next/link";

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
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap@3.3.7/dist/css/bootstrap.min.css"
          integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u"
          crossOrigin="anonymous"
        ></link>
      </Head>
      <NavBar />
      {children}
      <Footer />
    </>
  );
};

const NavBar = () => (
  <nav className="navbar navbar-default">
    <div className="container">
      <h1>
        <Link href="/">
          Ohlasy <small>dění na Boskovicku</small>
        </Link>
      </h1>
    </div>
  </nav>
);

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
              vydává{" "}
              <a href="https://wiki.ohlasy.info/9101128690ce46d6908f322fff37065e">
                spolek šílenců
              </a>
              ,{" "}
              <span className="nobreak">
                protože kdo jiný by dneska dělal noviny
              </span>
            </li>
            <li>nepoužíváme žádné cookies, respektujeme vaše soukromí</li>
            <li>
              <a href="https://wiki.ohlasy.info/4d80dd164e614461a16f4a65597c6304">
                inzerce
              </a>{" "}
              /<a href="http://archiv.ohlasy.info">archiv článků</a> /
              <a href="/podcast.html">podcast</a>
            </li>
            <li>
              <a href="mailto:ohlasy@ohlasy.info">ohlasy@ohlasy.info</a>
            </li>
            <li>+420 608 763 954</li>
            <li>
              <a href="https://forum.ohlasy.info">Diskuzní fórum</a>
            </li>
            <li>
              <a href="https://www.facebook.com/ohlasy">Facebook</a>
            </li>
            <li>
              <a
                href="https://www.vercel.com?utm_source=[ohlasy]&utm_campaign=oss"
                className="powered-by"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/vercel.svg" alt="Powered by Vercel" />
              </a>
            </li>
          </ul>
        </div>
        <div className="col-md-4">{/*{% include search-form.html %}*/}</div>
      </div>
    </div>
  </footer>
);
