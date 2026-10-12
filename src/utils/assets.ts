// Asset helper for GitHub Pages, production deploys, and local preview.
// Ensures that static images, videos, and public assets always resolve with the
// correct base path whether deployed at root (/) or in a GitHub repository subdirectory (/repo-name/).

export function getAssetUrl(path?: string | null): string {
  if (!path) return '';
  
  // Direct remote URLs or data/blob URIs shouldn't be altered
  if (
    path.startsWith('http://') ||
    path.startsWith('https://') ||
    path.startsWith('data:') ||
    path.startsWith('blob:')
  ) {
    return path;
  }

  // Handle any legacy /src/assets/images/ paths by redirecting to /images/
  let normalized = path;
  if (normalized.startsWith('/src/assets/images/')) {
    normalized = normalized.replace('/src/assets/images/', 'images/');
  } else if (normalized.startsWith('src/assets/images/')) {
    normalized = normalized.replace('src/assets/images/', 'images/');
  } else if (normalized.startsWith('/src/assets/')) {
    normalized = normalized.replace('/src/assets/', '');
  }

  // Strip leading slash so we can cleanly prepend base
  if (normalized.startsWith('/')) {
    normalized = normalized.slice(1);
  }

  const base = import.meta.env.BASE_URL || './';
  const prefix = base.endsWith('/') ? base : base + '/';
  return prefix + normalized;
}

export default getAssetUrl;
