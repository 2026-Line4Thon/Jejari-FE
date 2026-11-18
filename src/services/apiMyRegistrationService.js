import { jejariApi } from '../api/endpoints';
import { registrationModel } from '../api/mappers';

async function lists() {
  const [lost, found] = await Promise.all([jejariApi.myItems('lost'), jejariApi.myItems('found')]);
  return { items: [...lost.items, ...found.items], lost: lost.total_count, found: found.total_count };
}
export const apiMyRegistrationService = {
  async getStatus(itemId, type) {
    // LOST/FOUND IDs may overlap: always preserve the selected item's type.
    if (!type) throw new Error('선택한 등록의 분실·습득 유형을 확인해 주세요.');
    const response = await jejariApi.itemStatus(itemId, type);
    if (String(response.item_id) !== String(itemId) || response.item_type?.toLowerCase() !== type) throw new Error('선택한 등록의 상태 응답을 확인해 주세요.');
    return registrationModel({ id: itemId, item_type: type }, response);
  },
  async getOngoing() {
    const data = await lists();
    return data.items.filter((item) => item.status !== 'COMPLETED').map((item) => registrationModel(item));
  },
  async summary() {
    const [data, history] = await Promise.all([lists(), jejariApi.history()]);
    return { lost: data.lost, found: data.found, completed: history.total_count };
  },
};
