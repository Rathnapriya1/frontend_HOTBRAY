import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["picsum.photos", "www.shutterstock.com"],
  },
  remotePatterns: [
  {
    protocol: "http",
    hostname: "localhost",
    port: "4000",
    pathname: "/**",
  },
]
};

export default nextConfig;
