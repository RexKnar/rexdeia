module.exports = {
  reactStrictMode: true,
  transpilePackages: ['ui'],
  swcMinify: true,
  // Lint runs as a separate step; don't fail production builds on lint
  // violations (type-checking still runs during the build).
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    // Shrinks the dev module graph and improves prod tree-shaking by pulling
    // only the used members of these barrel packages instead of the whole index.
    optimizePackageImports: ['ui', 'lucide-react', 'date-fns'],
  },
  images: {
    domains: ['storage.googleapis.com','rexcoders.online', 'process.fs.teachablecdn.com'],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        stream: false,
        canvas: false,
      };
    }
    return config;
  },
};

// Injected content via Sentry wizard below

const { withSentryConfig } = require('@sentry/nextjs');

module.exports = withSentryConfig(
  module.exports,
  {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options

    // Suppresses source map uploading logs during build
    silent: true,
    org: 'test-dev-a7',
    project: 'javascript-nextjs',
  },
  {
    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Transpiles SDK to be compatible with IE11 (increases bundle size)
    transpileClientSDK: true,

    // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
    tunnelRoute: '/monitoring',

    // Hides source maps from generated client bundles
    hideSourceMaps: true,

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,

    // Enables automatic instrumentation of Vercel Cron Monitors.
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,
  }
);
