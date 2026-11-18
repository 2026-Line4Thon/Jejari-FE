import { apiId } from './endpoints';

export function resolvePlace(draft) {
  if (draft.placeId != null) return { place_id: Number(apiId(draft.placeId)), location_detail: draft.locationDetail ?? '' };
  let mapping;
  try { mapping = JSON.parse(import.meta.env.VITE_PLACE_IDS ?? '{}'); }
  catch { throw new Error('VITE_PLACE_IDS 장소 설정 형식을 확인해 주세요.'); }
  const place = (draft.place ?? '').trim();
  const building = Object.keys(mapping).sort((a, b) => b.length - a.length).find((name) => place === name || place.startsWith(name + ' '));
  if (!building) throw new Error('이 장소의 서버 ID가 아직 설정되지 않았어요. 서버에서 받은 장소 목록을 VITE_PLACE_IDS에 설정해 주세요.');
  return { place_id: Number(apiId(mapping[building])), location_detail: place.slice(building.length).trim() };
}
export function registrationTime(draft) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(draft.date ?? '') || !/^\d{2}:\d{2}$/.test(draft.time ?? '')) throw new Error('등록하려면 날짜와 시간을 모두 선택해 주세요.');
  const value = `${draft.date}T${draft.time}:00+09:00`;
  if (Number.isNaN(new Date(value).getTime())) throw new Error('올바른 날짜와 시간을 선택해 주세요.');
  return value;
}
export function foundRegistrationBody(item) {
  const draft = item.foundDraft ?? {};
  return { image_id: Number(apiId(item.imageId)), category: item.kind, item_name: [item.color, item.kind].filter(Boolean).join(' '), color: item.color || '', brand: item.brand || null,
    features: (item.appearance ?? '').split(/[,·\n]/).map((value) => value.trim()).filter(Boolean), description: draft.description ?? '',
    ...resolvePlace(draft), found_at: registrationTime(draft), storage_status: draft.storageStatus ?? 'SELF', storage_location: draft.storageLocation ?? '', private_features: item.privateFeature ?? '' };
}
export function lostRegistrationBody(draft, feature) {
  const fields = feature.features ?? feature.known ?? {};
  const category = draft.kind || fields.category;
  if (!category) throw new Error('물건 종류를 입력해 주세요.');
  return { ...(feature.imageId ? { image_id: feature.imageId } : {}), feature_chat_id: feature.chat_id,
    category, item_name: [draft.color || fields.color, category].filter(Boolean).join(' '), color: draft.color || fields.color || '', brand: draft.brand || fields.brand || null,
    features: ['size', 'material', 'shape', 'marks'].map((field) => fields[field]).filter(Boolean),
    description: draft.description || feature.summary || '', ...resolvePlace(draft), lost_from: registrationTime(draft) };
}
