export type FindMode = 'recommend' | 'browse';

export function getInitialFindMode(search: string): FindMode {
  if (!search) return 'recommend';
  const params = new URLSearchParams(search);
  if (params.get('mode') === 'browse') return 'browse';
  return ['q', 'sort', 'view'].some((key) => params.has(key)) ? 'browse' : 'recommend';
}
