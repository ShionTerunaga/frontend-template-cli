import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    reactCompiler: true,
    reactStrictMode: true,
    images: {
        remotePatterns: [new URL("https://ik.imagekit.io/**")]
    }
};

export default nextConfig;
