import { mockMyRegistrations } from '../mocks/myRegistrations';
import { matchingService } from './matchingService';
import { chatService } from './chatService';

export const myRegistrationService = {
  // GET /users/me/items/:itemId/status. Replace only this mock adapter later.
  async getStatus(itemId) {
    const registration = mockMyRegistrations.find((item) => String(item.id) === String(itemId));
    if (!registration) throw new Error('등록한 물건을 찾을 수 없어요.');
    const item = structuredClone(registration);
    if (item.status === 'candidates' || item.status === 'matching') {
      if (item.type === 'lost') {
        const result = await matchingService.getCandidates(item.id);
        if (result.lostItem.id !== item.id || result.lostItem.name !== item.name) throw new Error('선택한 물건의 매칭 정보를 확인해 주세요.');
        item.candidateCount = result.candidates.length;
        item.status = item.candidateCount ? 'candidates' : 'matching';
      }
    } else if (item.status === 'returning' && item.chatId) {
      const room = await chatService.getMessages(item.chatId);
      if (room.itemId !== item.id || room.item.name !== item.name) throw new Error('등록한 물건의 채팅 연결 정보를 확인해 주세요.');
      if (room.status === 'completed') item.status = 'completed';
    }
    return item;
  },
  // GET /users/me/items. Ongoing registrations exclude completed returns.
  async getOngoing() {
    const items = await Promise.all(mockMyRegistrations.map((item) => this.getStatus(item.id)));
    return items.filter((item) => item.status !== 'completed');
  },
};
