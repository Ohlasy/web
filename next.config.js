/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  trailingSlash: true,
  images: {
    remotePatterns: [
      { hostname: "**.kulturaboskovice.cz" },
      { hostname: "**.ohlasy.info" },
      { hostname: "ohlasy.info" },
      { hostname: "**.imgur.com" },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/feed.xml",
        destination: "/api/feeds/articles",
      },
      {
        source: "/podcast.xml",
        destination: "/api/feeds/podcast",
      },
      {
        source: "/podcast/feed.xml",
        destination: "/api/feeds/podcast",
      },
      {
        source: "/podcast/hrebenovka.xml",
        destination: "/api/feeds/hrebenovka",
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/podcast.html",
        destination: "/podcast/",
        permanent: true,
      },
      {
        source: "/go/cisla/",
        destination: "/stats/",
        permanent: true,
      },
      {
        source: "/go/petiletka/",
        destination: "https://data.ohlasy.info/2019/vyrocni-zprava.pdf",
        permanent: false,
      },
      {
        source: "/go/pripadovka/",
        destination: "https://data.ohlasy.info/2021/pripadovka.pdf",
        permanent: false,
      },
      {
        source: "/go/spolek",
        destination:
          "https://wiki.ohlasy.info/9101128690ce46d6908f322fff37065e",
        permanent: false,
      },
      {
        source: "/darujte/",
        destination: "https://www.darujme.cz/projekt/1202392",
        permanent: false,
      },
      {
        source: "/darujme/",
        destination: "https://www.darujme.cz/projekt/1202392",
        permanent: false,
      },
      {
        source: "/clanky/:year(\\d{4})",
        destination: "/clanky/?rok=:year",
        permanent: false,
      },
      {
        source: "/extra/",
        destination: "https://www.darujme.cz/ohlasy-extra",
        permanent: false,
      },
      {
        source: "/newsletter/",
        destination: "https://newsletter.ohlasy.info",
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
