/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/checkout',
        destination: '/order',
        permanent: false,
      },
      {
        source: '/beli',
        destination: '/order',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;

