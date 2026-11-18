import { jejariApi } from '../api/endpoints';
import { foundListModel, dateLabel, publicPhoto } from '../api/mappers';

export const queryService = {
  async home(signal) {
    const [home, profile, lost] = await Promise.all([jejariApi.home({ signal }), jejariApi.profile({ signal }), jejariApi.myItems('lost', { signal })]);
    const matches = lost.items.filter((item) => item.status === 'CANDIDATE_FOUND');
    return { nickname: profile.nickname, matchingCount: home.my_matching_count, matchingPath: matches.length === 1 ? '/matches?itemId=' + matches[0].id : '/mypage', items: home.recent_found_items.map(foundListModel) };
  },
  async foundItems(signal) {
    const items = [];
    for (let page = 1; ; page += 1) {
      const response = await jejariApi.foundItems(page, 10, { signal });
      if (!Array.isArray(response?.items)) throw new Error('습득물 목록 응답 형식을 확인해 주세요.');
      items.push(...response.items.map(foundListModel));
      if (!response.has_next) return items;
      if (!response.items.length) throw new Error('습득물 목록의 페이지 정보를 확인해 주세요.');
    }
  },
  async history(signal) {
    const response = await jejariApi.history({ signal });
    return { total: response.total_count, items: response.history.map((item) => ({
      id: item.chat_room_id, name: item.item_name, image: publicPhoto(item.blurred_image_url).source,
      tone: item.role === 'OWNER' ? 'found' : 'returned', label: item.role === 'OWNER' ? '찾았어요' : '찾아줬어요',
      date: dateLabel(item.completed_at) + ' 반환 완료', place: '', method: '',
    })) };
  },
};
