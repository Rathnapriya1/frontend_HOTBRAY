import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["picsum.photos", "di-uploads-pod7.dealerinspire.com"],
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
