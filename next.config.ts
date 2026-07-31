import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export: emits an `out/` folder of plain HTML/CSS/JS.
  // Deployable to Vercel, Netlify, GitHub Pages, or any static host.
  output: "export",
  images: {
    // next/image optimization needs a server; static export requires this off.
    unoptimized: true,
  },
};

export default nextConfig;
