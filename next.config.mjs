/** @type {import('next').NextConfig} */

const nextConfig = {
  compiler: {
    styledComponents: {
      ssr: true,
    }
  },
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '**.annihil.us',
        port: '',
      },
    ],
  },
};

export default nextConfig;
