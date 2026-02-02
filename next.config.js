/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
    },
    experimental: {
        serverComponentsExternalPackages: ['puppeteer-core', '@sparticuz/chromium', 'natural'],
        serverActions: {
            allowedOrigins: ['localhost:3000'],
        },
    },
    eslint: {
        // Warning: This allows production builds to successfully complete even if
        // your project has ESLint errors.
        ignoreDuringBuilds: true,
    },
    typescript: {
        // !! WARN !!
        // Dangerously allow production builds to successfully complete even if
        // your project has type errors.
        // !! WARN !!
        ignoreBuildErrors: true,
    },
    webpack: (config) => {
        config.externals.push({
            '@sparticuz/chromium': 'commonjs @sparticuz/chromium',
            'puppeteer-core': 'commonjs puppeteer-core',
            'webworker-threads': 'commonjs webworker-threads',
            'natural': 'commonjs natural', // treat natural as external too just in case
        });
        return config;
    },
}

module.exports = nextConfig
