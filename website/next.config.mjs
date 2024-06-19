/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {},
  env: {},
  transpilePackages: ["@moonpay/login-common", "@moonpay/login-sdk"],
  output: process.env.IS_DOCKER ? "standalone" : undefined,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
      };
    }
    return config;
  },
};

export default nextConfig;
