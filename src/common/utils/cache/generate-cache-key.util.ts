import crypto from 'crypto';

export function generateCacheKey(
  prefix: string,
  params: Record<string, any> = {},
  version?: string | number,
): string {
  const normalized = normalize(params);

  const payload = JSON.stringify(normalized);

  const hash = crypto.createHash('sha256').update(payload).digest('hex');

  const versionPart = version !== undefined ? `:v${version}` : 1;

  return `${prefix}${versionPart}:${hash}`;
}

function normalize(value: any): any {
  if (value instanceof Date) return value.toISOString();

  if (Array.isArray(value)) return value.map(normalize).sort();

  if (typeof value === 'object') {
    return Object.keys(value)
      .sort()
      .reduce(
        (acc, key) => {
          acc[key] = normalize(value[key]);
          return acc;
        },
        {} as Record<string, any>,
      );
  }

  return value;
}
