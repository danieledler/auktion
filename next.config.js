// const withPlugins = require('next-compose-plugins');
// const optimizedImages = require('next-optimized-images');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    loader: "custom",
  },
};

module.exports = nextConfig;
