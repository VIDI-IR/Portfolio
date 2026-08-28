import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /*
   * Emits .next/standalone — a self-contained server bundle with only the
   * node_modules the build actually traced. It is what keeps the runtime image
   * small, since nothing has to be installed at that stage.
   *
   * The bundle deliberately excludes `public` and `.next/static`; the docs
   * assume a CDN serves those. The Dockerfile copies them in instead.
   */
  output: "standalone",
};

export default nextConfig;
