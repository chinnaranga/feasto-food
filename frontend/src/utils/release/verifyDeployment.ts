import { ChecklistSummary, ChecklistItem } from '../../types/release';
import { validateEnvironment } from './validateEnvironment';

export const verifyDeployment = (): ChecklistSummary => {
  const items: ChecklistItem[] = [];

  // 1. Environment validation check
  const envVal = validateEnvironment();
  items.push({
    id: 'chk-env',
    name: 'Environment Configuration',
    status: envVal.isValid ? 'pass' : 'fail',
    description: envVal.isValid 
      ? 'All required Firebase client environment configurations are correctly initialized.' 
      : 'One or more required Firebase environment variable credentials are missing.',
    category: 'environment',
  });

  // 2. PWA Manifest check
  const manifest = document.querySelector('link[rel="manifest"]');
  items.push({
    id: 'chk-pwa-manifest',
    name: 'PWA Manifest Reference',
    status: manifest ? 'pass' : 'fail',
    description: manifest 
      ? 'PWA web application manifest link tags are registered in index.html.' 
      : 'Application manifest registration is missing from index.html headers.',
    category: 'pwa',
  });

  // 3. Service Worker check
  const swSupported = 'serviceWorker' in navigator;
  items.push({
    id: 'chk-pwa-sw',
    name: 'Service Worker Support',
    status: swSupported ? 'pass' : 'warn',
    description: swSupported 
      ? 'Active browser client supports offline PWA Service Worker caching.' 
      : 'Service Worker operations are unsupported or restricted on this browser agent.',
    category: 'pwa',
  });

  // 4. SEO description verification
  const metaDesc = document.querySelector('meta[name="description"]');
  const metaDescVal = metaDesc?.getAttribute('content');
  items.push({
    id: 'chk-seo-desc',
    name: 'SEO Description Tags',
    status: metaDescVal ? 'pass' : 'warn',
    description: metaDescVal 
      ? 'Search index description meta tags are correctly initialized.' 
      : 'Description meta tags are absent or missing details.',
    category: 'security',
  });

  // 5. PWA Mobile Web App meta checks
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  items.push({
    id: 'chk-pwa-theme',
    name: 'PWA Mobile Branding',
    status: metaTheme ? 'pass' : 'warn',
    description: metaTheme 
      ? 'Theme color meta tag is registered.' 
      : 'PWA mobile browser tint theme tag is missing.',
    category: 'pwa',
  });

  const totalCount = items.length;
  const passedCount = items.filter((i) => i.status === 'pass').length;
  const score = totalCount > 0 ? Math.round((passedCount / totalCount) * 100) : 100;

  return { score, passedCount, totalCount, items };
};
export default verifyDeployment;
