/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  i18n: {
    locales: ["cs"],
    defaultLocale: "cs",
  },
  images: {
    remotePatterns: [
      { hostname: "**.kulturaboskovice.cz" },
      { hostname: "**.ohlasy.info" },
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
        source: "/podcast.html",
        destination: "/podcast",
      },
    ];
  },
  trailingSlash: true,
};

module.exports = nextConfig;
