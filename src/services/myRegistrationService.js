import { matchingService } from './matchingService';
import { resolveRegistrationState } from '../utils/myRegistrationNavigation';

const API_BASE_URL = 'https://miseno.store';

function getAccessToken() {
  const accessToken = localStorage.getItem('access_token');
  if (!accessToken) throw new Error('로그인 후 등록 내역을 확인할 수 있어요.');
  return accessToken;
}

async function getJson(path) {
  const response = await fetch(API_BASE_URL + path, {
    headers: { Authorization: `Bearer ${getAccessToken()}` },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || '등록 내역을 불러오지 못했어요.');
  return data;
}

function readList(data, key, label) {
  const items = Array.isArray(data) ? data : data?.[key] ?? data?.results;
  if (!Array.isArray(items)) throw new Error(`${label} 응답에서 목록을 확인할 수 없어요.`);
  const total = Array.isArray(data) ? items.length : data.total_count ?? data.count ?? items.length;
  if (!Number.isSafeInteger(total) || total < items.length) throw new Error(`${label}의 총건수를 확인할 수 없어요.`);
  return { items, total };
}

function mapRegistration(item, detail = {}) {
  return {
    id: item.id,
    type: String(item.item_type || '').toLowerCase(),
    name: item.item_name || '등록 물품',
    place: detail.place_name || detail.place?.name || item.status_label || '등록한 물품',
    ...resolveRegistrationState(detail, item),
    photo: { source: item.thumbnail_url || detail.image_url || '', variant: '' },
  };
}

export const myRegistrationService = {
  async getStatus(itemId, type) {
    return getJson(`/users/me/items/${itemId}/status?type=${encodeURIComponent(type)}`);
  },

  async getProgress(itemId, type, item = {}) {
    const detail = await this.getStatus(itemId, type);
    const progress = resolveRegistrationState(detail, item);
    if (type === 'lost' && ['matching', 'candidates'].includes(progress.status) && !(progress.candidateCount > 0)) {
      try {
        const data = await matchingService.getCandidates(itemId);
        if (Array.isArray(data?.candidates) && (data.lost_item_id == null || String(data.lost_item_id) === String(itemId))) {
          return { ...detail, candidate_count: data.candidates.length };
        }
      } catch {
        // Keep the status response when the optional candidate lookup fails.
      }
    }
    return detail;
  },

  async getOngoing({ includeStats = false } = {}) {
    const [lostResponse, foundResponse] = await Promise.all([
      getJson('/users/me/items?type=lost'),
      getJson('/users/me/items?type=found'),
    ]);
    const lost = readList(lostResponse, 'items', '분실물 등록 내역');
    const found = readList(foundResponse, 'items', '습득물 등록 내역');
    const items = [...lost.items, ...found.items];
    const registrations = await Promise.all(items.map(async (item) => {
      try {
        const detail = await this.getProgress(item.id, String(item.item_type || '').toLowerCase(), item);
        return mapRegistration(item, detail);
      } catch {
        return mapRegistration(item);
      }
    }));
    const ongoing = registrations.filter((item) => item.status !== 'completed');
    if (!includeStats) return ongoing;
    const stats = { lost: lost.total, found: found.total, completed: null };
    let statsError = '';
    try {
      const history = await getJson('/users/me/history');
      stats.completed = readList(history, 'history', '반환 완료 내역').total;
    } catch (error) { statsError = error.message || '반환 완료 건수를 불러오지 못했어요.'; }
    return { items: ongoing, stats, statsError };
  },
};
