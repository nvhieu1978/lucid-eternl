// const config = {
//   plugins: ["@tailwindcss/postcss"],
// };

// export default config;


/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  plugins: ["@tailwindcss/postcss"],
  
  webpack: function (config, options) {
  config.experiments = {
  asyncWebAssembly: true,
  layers: true,
  };
  return config;
  },
  };
  export default nextConfig;