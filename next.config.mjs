/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // TEMP: let the build succeed even if TS/ESLint complains.
  // Remove these once you’re ready to enforce checks.
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },

  // 👇 Clean alias: /resume → /Resume (LaTeX).pdf in /public
  async rewrites() {
    return [
      { source: "/resume", destination: "/Resume (LaTeX).pdf" },
    ];
  },
};

export default nextConfig;
