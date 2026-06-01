/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Không để cảnh báo ESLint chặn build trên Vercel (lỗi type vẫn chặn như thường).
  eslint: { ignoreDuringBuilds: true },
};

module.exports = nextConfig;
