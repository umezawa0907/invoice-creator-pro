/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  async redirects() {
    return [
      // www付きドメインをwwwなしにリダイレクト
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.sakutto-app.jp',
          },
        ],
        destination: 'https://sakutto-app.jp/:path*',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
