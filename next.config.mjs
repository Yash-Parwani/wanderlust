/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com'
      }
    ]
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /maplibre-gl.css$/,
      use: ['style-loader', 'css-loader']
    })
    
    return config
  },
  transpilePackages: ['react-map-gl', 'maplibre-gl']
};

export default nextConfig;
