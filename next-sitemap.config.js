/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: process.env.SITE_URL || 'https://kushaltripathi.dev',
    generateRobotsTxt: true,
    generateIndexSitemap: false,
    outDir: './public',
    robotsTxtOptions: {
        policies: [
            {
                userAgent: '*',
                allow: '/',
            },
        ],
    },
    // Add additional paths if needed
    additionalPaths: async (config) => [
        await config.transform(config, '/'),
        await config.transform(config, '/about'),
        await config.transform(config, '/projects'),
        await config.transform(config, '/experience'),
        await config.transform(config, '/contact'),
    ],
};
