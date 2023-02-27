/** @type {import('next').NextConfig} */
module.exports = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["drive.google.com"],
  },
};
