import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://family-tax-flow.vercel.app';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/private/', // Optional: prevent crawling of any private internal admin routes
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}