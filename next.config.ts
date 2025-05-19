import type { NextConfig } from "next";

//f the PDF is hosted on a different domain, ensure the server allows CORS for your Next.js app. You may need to set the crossOrigin attribute or use a proxy in Next.js.

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/external-pdf/:path*',
        destination: 'https://example.com/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
