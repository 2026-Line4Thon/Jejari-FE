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

function normalizeStatus(status) {
  const value = String(status || '').toLowerCase();
  if (value.includes('complete')) return 'completed';
  if (value.includes('return')) return 'returning';
  if (value.includes('candidate') || value.includes('match')) return value.includes('ing') ? 'matching' : 'candidates';
  return 'matching';
}

function mapRegistration(item, detail = {}) {
  return {
    id: item.id,
    type: String(item.item_type || '').toLowerCase(),
    name: item.item_name || '등록 물품',
    place: detail.place_name || detail.place?.name || item.status_label || '등록한 물품',
    status: normalizeStatus(detail.status || item.status),
    candidateCount: Number(detail.candidate_count ?? detail.candidates_count ?? 0),
    chatId: detail.chat_room_id ?? detail.chat_id ?? null,
    photo: { source: item.thumbnail_url || detail.image_url || '', variant: '' },
  };
}

export const myRegistrationService = {
  async getStatus(itemId, type) {
    return getJson(`/users/me/items/${itemId}/status?type=${encodeURIComponent(type)}`);
  },

  async getOngoing() {
    const [lostItems, foundItems] = await Promise.all([
      getJson('/users/me/items?type=lost'),
      getJson('/users/me/items?type=found'),
    ]);
    const items = [...(Array.isArray(lostItems) ? lostItems : []), ...(Array.isArray(foundItems) ? foundItems : [])];
    const registrations = await Promise.all(items.map(async (item) => {
      try {
        const detail = await this.getStatus(item.id, String(item.item_type || '').toLowerCase());
        return mapRegistration(item, detail);
      } catch {
        return mapRegistration(item);
      }
    }));
    return registrations.filter((item) => item.status !== 'completed');
  },
};
