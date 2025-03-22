/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["randomuser.me", "images.unsplash.com", "placehold.co"],
  },
  env: {
    ENVIRONMENT: process.env.NODE_ENV || "development",
  },
  // Disable sourcemaps in production and staging
  productionBrowserSourceMaps: process.env.NODE_ENV === "development",
};

module.exports = nextConfig;
