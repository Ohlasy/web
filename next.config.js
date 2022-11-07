/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  experimental: { appDir: true },
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
    ];
  },
};

module.exports = nextConfig;
