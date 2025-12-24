import { NextRequest } from 'next/server';

export async function GET() {
  const baseUrl = 'https://invoice-sakutto.com'; // 本番環境のURL
  
  // 静的ページ
  const staticPages = [
    '',
    '/invoice/create',
    '/profile',
    '/glossary',
    '/glossary/tax/withholding-tax',
    '/glossary/invoice/invoice-basics',
    '/glossary/invoice/qualified-invoice',
    '/glossary/tax/consumption-tax',
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages.map((page) => {
    return `
    <url>
      <loc>${baseUrl}${page}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>${page === '' ? '1.0' : page.includes('glossary') ? '0.8' : '0.7'}</priority>
    </url>`;
  }).join('')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}