const isProd = process.env.NODE_ENV === 'production'
const currentBasePath = '/capitol-tracker-2025'

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    distDir: 'build',
    assetPrefix: isProd ? 'https://apps.montanafreepress.org/election-guide-2024' : undefined,
    basePath: currentBasePath,
    env: {
        BASE_PATH: currentBasePath,
    },
    trailingSlash: true,
    compiler: {
        emotion: true,
    },
    images: {
        unoptimized: true,
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'apps.montanafreepress.org',
                port: '',
                pathname: '/',
            }
        ]
    },
};

export default nextConfig;