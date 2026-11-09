/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Turns on unauthorized() and forbidden(), which are still experimental
    authInterrupts: true,
  },
};

export default nextConfig;
