/*
 * Absolute site URL, shared by metadata, robots and sitemap.
 *
 * VERCEL_PROJECT_PRODUCTION_URL is the production domain, deliberately not
 * VERCEL_URL: the latter is per-deployment, so a preview build would publish
 * throwaway URLs into your sitemap and preview cards.
 *
 * Set NEXT_PUBLIC_SITE_URL in Vercel once you attach a custom domain.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");
