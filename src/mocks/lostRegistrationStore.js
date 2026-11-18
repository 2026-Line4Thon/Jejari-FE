import { createLostItemSummary } from '../utils/lostItemSummary';

const previews = new Map();

export function createLostRegistrationPreview(draft, fields) {
  const id = 'preview-lost-' + globalThis.crypto.randomUUID();
  const item = { ...createLostItemSummary(draft, fields), id, type: 'lost', isPreview: true, status: 'matching', candidateCount: 0 };
  previews.set(id, item);
  return structuredClone(item);
}

// Router state can restore this local-only preview after a refresh.
export function restoreLostRegistrationPreview(item) {
  if (item?.isPreview === true && typeof item.id === 'string' && item.id.startsWith('preview-lost-')) previews.set(item.id, structuredClone(item));
}

export function getLostRegistrationPreview(id) {
  const item = previews.get(String(id));
  return item ? structuredClone(item) : null;
}

export function getLostRegistrationPreviews() {
  return structuredClone([...previews.values()]);
}
