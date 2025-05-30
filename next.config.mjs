import withPlugins from 'next-compose-plugins';
// import { withSitemap } from 'next-sitemap';

const isProd = process.env.NODE_ENV === 'production'
const currentBasePath = '/capitol-tracker-2025'

// TODO: Fix HTTPS issue with assetPrefix

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    distDir: 'build',
    assetPrefix: isProd ? 'https://projects.montanafreepress.org/capitol-tracker-2025' : undefined,
    // assetPrefix: 'http://projjects.montanafreepress.org/capitol-tracker-2025',
    // assetPrefix: 'http://localhost:3000/capitol-tracker-2025',
    basePath: currentBasePath,
    env: {
        BASE_PATH: currentBasePath,
    },
    publicRuntimeConfig: {
        basePath: currentBasePath,
    },
    trailingSlash: true,
    compiler: {
        emotion: true,
    },
    images: {
        unoptimized: true,
        // remotePatterns: [
        //     {
        //         protocol: 'https',
        //         hostname: 'projects.montanafreepress.org',
        //         port: '',
        //         pathname: '/**',
        //     }
        // ]
    },
};

export default withPlugins([], nextConfig);