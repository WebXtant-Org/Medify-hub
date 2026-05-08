/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  basePath: process.env.BASEPATH,
  // We removed the i18n redirects to allow the public landing page at '/'
  // and direct access to /admin, /dashboard, etc.
}

export default nextConfig
