import { foundItemService, itemApiId, requestItemApi } from './foundItemService';
import { matchingService } from './matchingService';

export const foundItemDetailService = {
  getDetail(id, options) {
    return foundItemService.getDetail(id, options);
  },

  async getOwnershipCandidate(foundItemId, { signal } = {}) {
    const foundId = itemApiId(foundItemId);
    const data = await requestItemApi('/users/me/items?type=lost', { signal });
    const items = Array.isArray(data) ? data : data?.items ?? data?.results;
    if (!Array.isArray(items)) throw new Error('내 분실물 목록을 확인할 수 없어요.');
    const ongoing = items.filter((item) => String(item.status).toUpperCase() !== 'COMPLETED');
    if (!ongoing.length) throw new Error('등록한 분실물이 없어요. 먼저 분실물을 등록해 주세요.');

    const results = await Promise.allSettled(ongoing.map(async (item) => {
      const result = await matchingService.getCandidates(item.id, { signal });
      if (!Array.isArray(result?.candidates) || String(result.lost_item_id) !== String(item.id)) {
        throw new Error('내 분실물의 매칭 정보를 확인할 수 없어요.');
      }
      const candidate = result.candidates.find((entry) => String(entry.found_item?.found_item_id) === foundId);
      return candidate ? { candidateId: itemApiId(candidate.candidate_id), lostItemId: item.id } : null;
    }));
    const match = results.find((result) => result.status === 'fulfilled' && result.value);
    if (match) return match.value;
    const failure = results.find((result) => result.status === 'rejected');
    if (failure) throw failure.reason;
    throw new Error('아직 내 분실물의 매칭 후보에 포함되지 않았어요. 매칭 현황을 확인해 주세요.');
  },
};
