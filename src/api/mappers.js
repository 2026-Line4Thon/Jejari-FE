import placeholder from '../assets/recent-found/placeholder.svg';

export function dateLabel(value, withTime = false) {
  const date = new Date(value);
  if (!value || Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('ko-KR', { timeZone: 'Asia/Seoul', month: 'long', day: 'numeric', ...(withTime ? { hour: 'numeric', minute: '2-digit' } : {}) }).format(date);
}
export function publicPhoto(url) {
  // Never substitute an unrelated item's photo for a missing server image.
  return { source: typeof url === 'string' && /^(https?:\/\/|\/[^/])/.test(url) ? url : placeholder, variant: '' };
}
export function lostItemModel(data) {
  return { id: data.lost_item_id, name: data.item_name, category: data.category, color: data.color ?? '', brand: data.brand ?? '', place: [data.place?.name, data.location_detail].filter(Boolean).join(' '), dateLabel: dateLabel(data.lost_from), photo: publicPhoto(data.image_url), status: data.status, candidateCount: data.candidate_count ?? 0 };
}
export function candidateModel(data) {
  const item = data.found_item;
  if (!item || !data.candidate_id) throw new Error('매칭 후보 응답 형식을 확인해 주세요.');
  return {
    id: data.candidate_id, name: item.item_name, status: data.status,
    similarity: data.similarity_label === '높은 유사도' ? 'high' : 'low',
    attributes: item.features?.join(' · ') || [item.category, item.color].filter(Boolean).join(' · '),
    place: item.place_name ?? '', foundAtLabel: dateLabel(item.found_at, true), photo: publicPhoto(item.image_url),
    reasons: (data.reasons ?? []).map((reason, index) => ({ title: ({ category: '물건 종류', color: '색상', appearance: '외형과 특징', place: '발견 장소', time: '발견 시점' })[reason.field] ?? `매칭 근거 ${index + 1}`, description: reason.text })),
  };
}
export function foundListModel(item) {
  return { id: item.id, name: item.item_name, place: item.found_location, image: publicPhoto(item.blurred_image_url).source, date: dateLabel(item.created_at, true), status: 'found' };
}
const statuses = { WAITING: 'matching', CANDIDATE_FOUND: 'candidates', CHATTING: 'returning', COMPLETED: 'completed' };
export function registrationModel(item, status = item) {
  return {
    id: item.id ?? status.item_id, type: (item.item_type ?? status.item_type ?? '').toLowerCase(), name: status.item_name ?? item.item_name,
    status: statuses[status.status] ?? 'unknown', statusLabel: status.status_label ?? item.status_label,
    candidateCount: status.candidate_count, photo: publicPhoto(item.thumbnail_url), place: item.place_name ?? '',
    chatId: status.next_action?.action_type === 'GO_TO_CHAT' ? status.next_action.target_id : null,
  };
}
export function chatModel(data) {
  return {
    id: String(data.chat_room_id), status: data.status === 'COMPLETED' ? 'completed' : 'active',
    item: { name: data.item_summary?.item_name ?? '', place: '', dateLabel: '', photo: publicPhoto(data.item_summary?.blurred_image_url) },
    dateLabel: dateLabel(data.messages?.[0]?.created_at), unread: false, updatedLabel: '',
    messages: (data.messages ?? []).map((message) => ({ id: String(message.message_id), sender: message.is_mine ? 'me' : 'other', text: message.content })),
    // The contract has no structured meeting metadata. Do not infer it from text.
    meeting: null,
  };
}
