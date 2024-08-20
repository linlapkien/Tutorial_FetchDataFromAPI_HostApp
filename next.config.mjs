import NextFederationPlugin from '@module-federation/nextjs-mf';

const remotes = (isServer) => {
  const location = isServer ? 'ssr' : 'chunks';
  return {
    component_app: `component_app@http://localhost:3002/_next/static/${location}/remoteEntry.js`,
  };
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
    ];
  },
  webpack(config, options) {
    const { isServer } = options;
    config.plugins.push(
      new NextFederationPlugin({
        name: 'host',
        remotes: remotes(isServer),
        filename: 'static/chunks/remoteEntry.js',
        exposes: {},
        extraOptions: {
          debug: false, // `false` by default
          exposePages: false, // `false` by default
        },
        shared: {},
      })
    );

    return config;
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.thecocktaildb.com',
        pathname: '**',
      },
    ],
  },
};

export default nextConfig;
