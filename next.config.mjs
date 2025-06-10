/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  distDir: 'out', // 将构建输出目录改为 my-custom-build
  experimental: {
    transpilePackages: ['tdesign-react'],
  },
};

export default nextConfig;
