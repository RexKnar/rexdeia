/** @type {import('next').NextConfig} */
const { withSentryConfig } = require('@sentry/nextjs');

const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['ui'],
  
  // Add memory optimizations
  swcMinify: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,

  // Optimize image handling
  images: {
    minimumCacheTTL: 60,
    deviceSizes: [640, 768, 1024],
    imageSizes: [16, 32, 48, 64],
  },

  // Add experimental optimizations
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@sentry/nextjs', 'ui'],
    turbotrace: {
      memoryLimit: 1500, // Reduced for 2GB environment
      logLevel: 'error'
    }
  },

  // Optimize webpack configuration
  webpack: (config, { isServer }) => {
    // Optimize chunk size
    config.optimization = {
      ...config.optimization,
      moduleIds: 'deterministic',
      chunkIds: 'deterministic',
      splitChunks: {
        chunks: 'all',
        minSize: 20000,
        maxSize: 40000,
        cacheGroups: {
          default: false,
          vendors: false,
          commons: {
            name: 'commons',
            chunks: 'all',
            minChunks: 2,
            reuseExistingChunk: true,
          },
          lib: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              const packageName = module.context.match(
                /[\\/]node_modules[\\/](.*?)([\\/]|$)/
              )[1];
              return `npm.${packageName.replace('@', '')}`;
            },
            chunks: 'all',
          },
        },
      },
    };

    // Reduce bundle size
    if (!isServer) {
      config.optimization.minimize = true;
    }

    return config;
  }
};

// Optimize Sentry config
const sentryWebpackPluginOptions = {
  silent: true,
  org: 'test-dev-a7',
  project: 'javascript-nextjs',
  
  // Reduce memory usage during source map generation
  setCommits: false,
  sourcemaps: {
    assets: '.next/static/**/*.js',
    stripPrefix: ['webpack://_N_E/'],
  }
};

const sentryOptions = {
  widenClientFileUpload: false, // Disable for memory optimization
  transpileClientSDK: false,    // Disable if you don't need IE11 support
  tunnelRoute: '/monitoring',
  hideSourceMaps: true,
  disableLogger: true,
  automaticVercelMonitors: true,
};

// Export with memory-optimized settings
module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions, sentryOptions);