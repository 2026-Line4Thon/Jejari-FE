import { createMockFoundMatching } from '../mocks/foundItems';
import { createLocalFoundPhotos, getFoundPhotoFile } from './foundPhotoStore';

const API_BASE_URL = 'https://miseno.store';
export const CAMPUS_PLACES = ['중앙도서관', '학생회관', '대학본부', '경영관', '인문사회관', '공학관', '자연과학관', '국제관', '창업지원센터', '미래관', '기숙사', '체육관', '대강당'];

// Keep the existing login's access_token and API host; no new auth layer.
export async function requestItemApi(path, { method = 'GET', body, signal } = {}) {
  const token = localStorage.getItem('access_token');
  if (!token) throw new Error('로그인 후 이용할 수 있어요.');
  const headers = { Authorization: `Bearer ${token}` };
  const form = body instanceof FormData;
  if (body !== undefined && !form) headers['Content-Type'] = 'application/json';
  const response = await fetch(API_BASE_URL + path, { method, headers, body: body === undefined ? undefined : form ? body : JSON.stringify(body), signal });
  const text = response.status === 204 ? '' : await response.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; }
  catch { if (response.ok) throw new Error('서버 응답 형식을 확인해 주세요.'); }
  if (!response.ok) {
    const detail = typeof data?.detail === 'string' ? data.detail : Array.isArray(data?.detail) ? data.detail.map((entry) => entry.msg).filter(Boolean).join(' ') : '';
    const fields = data && typeof data === 'object' ? Object.values(data).flat().filter((value) => typeof value === 'string') : [];
    const error = new Error(detail || fields.join(' ') || '요청을 처리하지 못했어요.');
    error.status = response.status;
    throw error;
  }
  return data;
}

export function itemApiId(value) {
  if (!/^\d+$/.test(String(value)) || !Number.isSafeInteger(Number(value)) || Number(value) < 1) throw new Error('물건 또는 확인 정보의 ID가 올바르지 않아요.');
  return String(value);
}

async function placeFields(draft) {
  const place = (draft.place || '').trim();
  const name = CAMPUS_PLACES.find((building) => place === building || place.startsWith(building + ' '));
  if (!name) throw new Error('목록에서 분실·습득 장소를 선택해 주세요.');
  const places = await foundItemService.getPlaces();
  const selected = places.find((entry) => entry.name === name);
  if (!selected) throw new Error('선택한 장소 정보를 확인할 수 없어요. 잠시 후 다시 시도해 주세요.');
  return { place_id: selected.id, location_detail: draft.locationDetail || place.slice(name.length).trim() };
}

function dateTime(draft) {
  if (!draft.date || !draft.time) throw new Error('등록하려면 날짜와 시간을 모두 선택해 주세요.');
  const value = `${draft.date}T${draft.time}:00+09:00`;
  if (Number.isNaN(new Date(value).getTime())) throw new Error('날짜와 시간을 확인해 주세요.');
  return value;
}

async function analyzePhoto(type, draft, signal) {
  const photo = draft?.photos?.[0];
  const file = getFoundPhotoFile(photo?.id);
  if (!file) throw new Error('분석할 사진을 다시 선택해 주세요.');
  if (!['image/jpeg', 'image/png'].includes(file.type) || file.size > 10 * 1024 * 1024) throw new Error('jpg, png 형식의 10MB 이하 사진을 선택해 주세요.');
  const form = new FormData();
  form.append('image', file);
  const data = await requestItemApi(`/items/${type}/images/analyze`, { method: 'POST', body: form, signal });
  if (!data?.image_id || !data.tags) throw new Error('사진 분석 응답을 확인해 주세요.');
  return { imageId: data.image_id, analysisPhotoId: photo.id, photo: data.image_url, kind: data.tags.category || '', itemName: data.tags.item_name || '', color: data.tags.color || '', brand: data.tags.brand || '', appearance: (data.tags.features || []).join(', '), privateFeature: '', privacyProtected: data.is_blurred === true };
}

export const foundItemService = {
  async getPlaces({ signal } = {}) {
    const data = await requestItemApi('/places', { signal });
    const places = Array.isArray(data) ? data : data?.places;
    if (!Array.isArray(places)) throw new Error('장소 목록 응답을 확인해 주세요.');
    return places.filter((place) => CAMPUS_PLACES.includes(place.name)).map((place) => ({ id: Number(itemApiId(place.place_id ?? place.id)), name: place.name }));
  },
  async selectPhotos(origin, files) {
    return createLocalFoundPhotos(files, origin);
  },
  async analyze(foundDraft, { signal } = {}) {
    return analyzePhoto('found', foundDraft, signal);
  },
  async analyzeLost(lostDraft, { signal } = {}) { return analyzePhoto('lost', lostDraft, signal); },
  async getList({ signal } = {}) {
    const data = await requestItemApi('/items/found', { signal });
    if (data == null) return [];
    const items = Array.isArray(data) ? data : data.items ?? data.results;
    if (!Array.isArray(items)) throw new Error('습득물 목록 응답을 확인해 주세요.');
    return items;
  },
  async getDetail(id, { signal } = {}) { return requestItemApi(`/items/found/${itemApiId(id)}`, { signal }); },
  async getLost(id, { signal } = {}) { return requestItemApi(`/items/lost/${itemApiId(id)}`, { signal }); },
  async register(item) {
    const draft = item.foundDraft || {};
    const foundAt = dateTime(draft);
    const place = await placeFields(draft);
    let current = item;
    if (!item.imageId || item.analysisPhotoId !== draft.photos?.[0]?.id) {
      const analysis = await this.analyze(draft);
      current = { ...analysis, ...item, imageId: analysis.imageId, analysisPhotoId: analysis.analysisPhotoId, photo: analysis.photo, privacyProtected: analysis.privacyProtected };
    }
    const data = await requestItemApi('/items/found', { method: 'POST', body: {
      image_id: current.imageId, category: current.kind, item_name: [current.color, current.kind].filter(Boolean).join(' '), color: current.color, brand: current.brand || null,
      features: (current.appearance || '').split(/[,·\n]/).map((value) => value.trim()).filter(Boolean), description: draft.description || '',
      ...place, found_at: foundAt, storage_status: draft.storageStatus || 'SELF', storage_location: draft.storageLocation || '', private_features: current.privateFeature || '',
    } });
    if (!data?.found_item_id) throw new Error('등록 응답에 습득물 ID가 없어요.');
    return { ...current, id: data.found_item_id, status: data.status };
  },
  async startFeatures(draft, { signal } = {}) {
    if (!draft) throw new Error('먼저 분실물 기본 정보를 입력해 주세요.');
    const analysis = draft.mode === 'text' ? null : await this.analyzeLost(draft, { signal });
    const data = await requestItemApi('/items/lost/feature-chats', { method: 'POST', body: { ...(analysis ? { image_id: analysis.imageId } : {}), description: [draft.kind, draft.color, draft.brand, draft.description].filter(Boolean).join(' ') }, signal });
    if (!data?.chat_id) throw new Error('특징 대화 정보를 확인해 주세요.');
    return { ...data, imageId: analysis?.imageId, photo: analysis?.photo };
  },
  async answerFeatures(id, question, answer) {
    return requestItemApi(`/items/lost/feature-chats/${itemApiId(id)}/answers`, { method: 'POST', body: { step: question.step, answer: answer.trim(), is_skipped: answer === '잘 모르겠어요' } });
  },
  async finishFeatures(id) { return requestItemApi(`/items/lost/feature-chats/${itemApiId(id)}/finish`, { method: 'POST' }); },
  async registerLost(draft, feature) {
    const fields = feature.features || feature.known || {};
    const category = draft.kind || fields.category;
    if (!category) throw new Error('물건 종류를 확인해 주세요.');
    const lostFrom = dateTime(draft);
    const place = await placeFields(draft);
    const data = await requestItemApi('/items/lost', { method: 'POST', body: {
      ...(feature.imageId ? { image_id: feature.imageId } : {}), feature_chat_id: feature.chat_id,
      category, item_name: [draft.color || fields.color, category].filter(Boolean).join(' '), color: draft.color || fields.color || '', brand: draft.brand || fields.brand || null,
      features: ['size', 'material', 'shape', 'marks'].map((key) => fields[key]).filter(Boolean), description: draft.description || feature.summary || '', ...place, lost_from: lostFrom,
    } });
    if (!data?.lost_item_id) throw new Error('등록 응답에 분실물 ID가 없어요.');
    return data;
  },
  // Finder-facing candidate-list endpoint is not in the supplied API catalog.
  // Keep this mock boundary until its request/response contract is defined.
  async getMatchingResults(foundItem) {
    if (foundItem?.id && /^\d+$/.test(String(foundItem.id))) throw new Error('습득자 측 후보 목록 조회 API가 아직 제공되지 않았어요. 마이페이지에서 등록 상태를 확인해 주세요.');
    return createMockFoundMatching(foundItem);
  },
  // GET /candidates/:candidateId: map the eventual response into this public UI model.
  async getMatchingCandidate(candidateId) {
    const candidate = createMockFoundMatching().candidates.find((item) => item.id === candidateId);
    if (!candidate) throw new Error('매칭 후보를 찾을 수 없어요. 다른 후보를 확인해 주세요.');
    return candidate;
  },
};
