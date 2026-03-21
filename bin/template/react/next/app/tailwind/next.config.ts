import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    reactCompiler: true,
    images: {
        remotePatterns: [
            new URL("https://ik.imagekit.io/**"),
            new URL("https://images.dog.ceo/**")
        ]
    }
};

export default nextConfig;
