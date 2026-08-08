import { MetadataRoute } from 'next';
import { STATE_NAMES } from '@/lib/stateData';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://family-tax-flow.vercel.app';

  // 1. Root / Main Engine Page
  const mainRoute = {
    url: baseUrl,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 1.0,
  };

  // 2. Generate entries for all 50 States + DC
  const stateRoutes = Object.keys(STATE_NAMES).map((stateCode) => ({
    url: `${baseUrl}/calculators/${stateCode.toLowerCase()}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [mainRoute, ...stateRoutes];
}