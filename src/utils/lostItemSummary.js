import placeholder from '../assets/recent-found/placeholder.svg';

const text = (value) => typeof value === 'string' ? value.trim() : '';

export function createLostItemSummary(draft = {}, fields = {}) {
  const date = text(draft.date);
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  return {
    name: text(draft.kind) || text(fields.category) || '물건 종류 미입력',
    place: text(draft.place) || '미입력',
    color: text(draft.color) || text(fields.color) || '미입력',
    brand: text(draft.brand) || text(fields.brand) || '미입력',
    material: text(fields.material) || '미입력',
    dateLabel: match ? `${Number(match[2])}월 ${Number(match[3])}일` : date || '미입력',
    photo: { source: draft.photos?.[0]?.source || placeholder, variant: '' },
  };
}
