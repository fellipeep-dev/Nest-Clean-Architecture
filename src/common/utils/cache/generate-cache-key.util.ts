import crypto from 'crypto';

export function generateCacheKey(
  prefix: string,
  params: Record<string, any> = {},
): string {
  const cleanParams = Object.entries(params)
    .filter(([_, v]) => v !== undefined && v !== null)
    .sort(([a], [b]) => a.localeCompare(b));

  const paramString = JSON.stringify(cleanParams);

  const hash = crypto.createHash('md5').update(paramString).digest('hex');

  return `${prefix}:${hash}`;
}
