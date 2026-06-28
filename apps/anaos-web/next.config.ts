import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "@prisma/client",
    "bcryptjs",
    "edge-tts-node",
    "ws",
    "bufferutil",
    "utf-8-validate",
  ],
};

export default nextConfig;
