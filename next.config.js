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
    ];
  },
};

module.exports = nextConfig;
