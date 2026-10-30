/** @type {import('next').NextConfig} */
const nextConfig = {
  // Production builds go to a separate directory (NEXT_DIST_DIR=.next-prod, see package.json
  // and scripts/launchd) so that `next build` does not wipe the `.next` used by the running
  // dev server. Unset means the Next.js default.
  distDir: process.env.NEXT_DIST_DIR || ".next",
};

export default nextConfig;
