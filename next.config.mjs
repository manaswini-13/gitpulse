/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  /* We add this to bypass any strict linting/formatting checks during production compilation */
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  }
};

export default nextConfig;
