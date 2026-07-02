/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: [
      "@prisma/client",
      "bcryptjs",
      "edge-tts-node",
      "ws",
      "bufferutil",
      "utf-8-validate",
    ],
  },
};

export default nextConfig;
