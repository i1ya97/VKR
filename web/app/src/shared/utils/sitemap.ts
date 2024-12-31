import dayjs from "dayjs";

export interface Page {
  path: string;
  name: string;
  lastmod?: string;
  priority?: number;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  disableSitemap?: boolean;
}

export const sitemap: Page[] = [
  { path: '/', name: 'index', lastmod: dayjs().format('YYYY-MM-DD'), priority: 1.0, changefreq: 'always' },
  { path: '*', name: 'other', disableSitemap: true },

];
