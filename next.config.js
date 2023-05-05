/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
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
        destination:
          "https://www.notion.so/ohlasy/Ohlasy-v-slech-0cce47372104440485ff3ddeb90705c3",
        permanent: false,
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
        // This is a temporary measure after moving to Next, safe to delete later
        source: "/assets/favicon.png",
        destination: "/favicon.png",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
