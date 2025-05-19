/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/pdf/:path*',
        destination: 'https://www.aeee.in/wp-content/uploads/2020/08/:path*',
      },
      {
        // Proxy requests like '/pdf/pdfs/doc1.pdf' to GCS
        source: '/ggPDF/:path*',
        destination: 'https://storage.googleapis.com/my-bucket/:path*',
      },
    ];
  },

  async headers() {
    return [
      {
        source: '/pdf/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' }, // Replace '*' with 'https://your-app.com' in production
          { key: 'Access-Control-Allow-Methods', value: 'GET, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type' },
        ],
      },
    ];
  },

  // Optional: Optimize for production
  reactStrictMode: true,
};

module.exports = nextConfig;