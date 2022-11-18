/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
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
};

module.exports = nextConfig;
