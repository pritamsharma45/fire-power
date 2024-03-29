/** @type {import('next').NextConfig} */
module.exports = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: [
      "nextjs-ecommerce-six-lemon.vercel.app",
      "woodhood.co.in",
      "drive.google.com",
      "drive.usercontent.google.com",
      "lh3.googleusercontent.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "drive.google.com",
      },
    ],
    unoptimized: true,
  },
};
