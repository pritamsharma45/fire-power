/** @type {import('next').NextConfig} */
module.exports = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["nextjs-ecommerce-ten-delta.vercel.app","drive.google.com"],
  },
};
