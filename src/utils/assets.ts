// Asset helper for GitHub Pages, production deploys, and local preview.
// Ensures that static images, videos, and public assets always resolve with the
// correct base path whether deployed at root (/) or in a GitHub repository subdirectory (/repo-name/).

export function getAssetUrl(path?: string | null): string {
  if (!path) return '';

  // 1. Direct remote URLs, data URIs, or blob URIs must never be altered
  if (
    path.startsWith('http://') ||
    path.startsWith('https://') ||
    path.startsWith('data:') ||
    path.startsWith('blob:')
  ) {
    return path;
  }

  const base =
    (typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL) || './';
  const prefix = base.endsWith('/') ? base : base + '/';
  const cleanBase = base.replace(/^\/|\/$/g, '');

  // 2. If path ALREADY starts with the deployed base path (e.g. /Stackd-Bombay/assets/...)
  // Vite automatically prefixes import.meta.env.BASE_URL onto bundled assets (like imported images).
  // Prepending it again causes double-prefix 404 errors (e.g. /Stackd-Bombay/Stackd-Bombay/assets/...).
  if (cleanBase && cleanBase !== '.') {
    if (path.startsWith(base)) {
      return path;
    }
    if (path.startsWith('/' + cleanBase + '/')) {
      return path;
    }
    if (path.startsWith(cleanBase + '/')) {
      return (base.startsWith('/') ? '/' : '') + path;
    }
  }

  // 3. If path is a relative bundled asset produced by Vite (e.g. ./assets/... or assets/...)
  if (path.startsWith('./assets/') || path.startsWith('assets/')) {
    if (base === './' || base === '') {
      return path.startsWith('./') ? path : './' + path;
    }
    const withoutDotSlash = path.replace(/^\.\//, '');
    return prefix + withoutDotSlash;
  }

  // 4. Handle legacy or development /src/assets/images/ paths by redirecting to public /images/
  let normalized = path;
  if (normalized.startsWith('/src/assets/images/')) {
    normalized = normalized.replace('/src/assets/images/', 'images/');
  } else if (normalized.startsWith('src/assets/images/')) {
    normalized = normalized.replace('src/assets/images/', 'images/');
  } else if (normalized.startsWith('/src/assets/')) {
    normalized = normalized.replace('/src/assets/', '');
  }

  // 5. Strip leading slash or relative ./ so we can cleanly prepend base
  if (normalized.startsWith('./')) {
    normalized = normalized.slice(2);
  } else if (normalized.startsWith('/')) {
    normalized = normalized.slice(1);
  }

  // Prevent double prefixing if normalized now begins with cleanBase
  if (cleanBase && cleanBase !== '.' && normalized.startsWith(cleanBase + '/')) {
    return (base.startsWith('/') ? '/' : '') + normalized;
  }

  return prefix + normalized;
}

export default getAssetUrl;
