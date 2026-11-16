export function formatFoundDate(value) {
  if (!value) return '';
  const date = new Date(value + 'T00:00:00');
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' });
}
