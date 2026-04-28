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
    minimumCacheTTL: 604800, // one week
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
        /** RSS feed serviced by an endpoint in the `pages` router */
        source: "/feed.xml",
        destination: "/api/feeds/articles",
      },
      {
        /** Legacy feed URL for the Ohlasy podcast */
        source: "/podcast.xml",
        destination: "/podcasty/ohlasy/feed",
      },
      {
        /** Legacy feed URL for the Ohlasy podcast */
        source: "/podcast/feed.xml",
        destination: "/podcasty/ohlasy/feed",
      },
      {
        /** Legacy feed URL for the Hřebenovka podcast */
        source: "/podcast/hrebenovka.xml",
        destination: "/podcasty/hrebenovka/feed",
      },
    ];
  },
  async redirects() {
    return [
      {
        /** Legacy podcasting homepage */
        source: "/podcast.html",
        destination: "/podcasty/",
        permanent: true,
      },
      {
        /** Legacy podcasting homepage */
        source: "/podcast",
        destination: "/podcasty/",
        permanent: true,
      },
      {
        /** Fundraising shortcut */
        source: "/darujte/",
        destination: "https://www.darujme.cz/projekt/1202392",
        permanent: false,
      },
      {
        /** Fundraising shortcut */
        source: "/darujme/",
        destination: "https://www.darujme.cz/projekt/1202392",
        permanent: false,
      },
      {
        /** Fundraising shortcut */
        source: "/extra/",
        destination: "https://www.darujme.cz/ohlasy-extra",
        permanent: false,
      },
      {
        source: "/clanky/:year(\\d{4})",
        destination: "/clanky/?rok=:year",
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
