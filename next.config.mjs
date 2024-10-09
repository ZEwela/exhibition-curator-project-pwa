import withPWA from "next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nrs.harvard.edu",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "openaccess-cdn.clevelandart.org",
        pathname: "/**",
      },
    ],
  },
};

const pwaConfig = {
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
  swSrc: "service-worker.js",
};

export default withPWA(pwaConfig)(nextConfig);
