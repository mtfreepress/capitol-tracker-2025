const isProd = process.env.NODE_ENV === 'production'
const currentBasePath = '/capitol-tracker-2025'

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    distDir: 'build',
    assetPrefix: isProd ? 'https://projects.montanafreepress.org/capitol-tracker-2025' : undefined,
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
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'projects.montanafreepress.org',
                port: '',
                pathname: '/',
            }
        ]
    },
};

export default nextConfig;