/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cloudflare Pages serves this as static files; only /api/get-support
  // runs server-side, as a separate Pages Function in /functions, not
  // through Next's own API routes.
  output: "export",
  images: {
    // The on-demand image optimizer needs a server, which static export
    // doesn't have. Images still work, just unresized/unconverted.
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "image.qwenlm.ai" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;