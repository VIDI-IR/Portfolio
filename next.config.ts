import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /*
   * Standalone output is only for the container build.
   *
   * It emits .next/standalone — a self-contained server bundle carrying just
   * the node_modules the build traced — which is what keeps the Docker runtime
   * image small. The bundle deliberately excludes `public` and `.next/static`
   * (the docs assume a CDN serves those); the Dockerfile copies them in.
   *
   * Gated on DOCKER_BUILD, set in the Dockerfile, because it is wrong
   * everywhere else: Vercel detects the framework and applies its own
   * deployment strategy, and locally it just leaves a stray .next/standalone
   * behind and makes `next start` refuse to run.
   */
  output: process.env.DOCKER_BUILD ? "standalone" : undefined,
};

export default nextConfig;
