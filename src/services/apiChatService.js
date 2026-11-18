import { jejariApi } from '../api/endpoints';
import { chatModel, dateLabel } from '../api/mappers';
const listeners = new Set();
const notify = () => listeners.forEach((listener) => listener());

export const apiChatService = {
  async getChats({ unreadOnly = false } = {}) {
    if (unreadOnly) throw new Error('안읽음 여부를 조회하는 API가 명세에 아직 없어요. 전체 목록을 확인해 주세요.');
    // Compose documented APIs; there is no GET /chats list endpoint.
    const [lost, found, history] = await Promise.all([jejariApi.myItems('lost'), jejariApi.myItems('found'), jejariApi.history()]);
    const statuses = await Promise.all([...lost.items, ...found.items].filter((item) => item.status === 'CHATTING').map((item) => jejariApi.itemStatus(item.id, item.item_type.toLowerCase())));
    const ids = new Set(history.history.map((item) => item.chat_room_id));
    statuses.forEach((item) => { if (item.next_action?.action_type === 'GO_TO_CHAT') ids.add(item.next_action.target_id); });
    return Promise.all([...ids].map((id) => this.getMessages(id)));
  },
  async createChat(candidate) {
    const data = await jejariApi.createChat(candidate.id);
    return this.getMessages(data.chat_room_id);
  },
  async getMessages(roomId) {
    const data = await jejariApi.messages(roomId);
    const seen = new Set(data.messages.map((message) => message.message_id));
    let batch = data.messages;
    for (let page = 2; batch.length === 30; page += 1) {
      const next = await jejariApi.messages(roomId, page);
      batch = next.messages.filter((message) => !seen.has(message.message_id));
      if (!batch.length) break;
      batch.forEach((message) => seen.add(message.message_id));
      data.messages.push(...batch);
    }
    data.messages.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    const room = chatModel(data);
    if (String(room.id) !== String(roomId)) throw new Error('선택한 채팅방의 응답 정보를 확인해 주세요.');
    room.updatedLabel = dateLabel(data.messages?.at(-1)?.created_at, true);
    room.canComplete = room.status === 'active';
    return room;
  },
  async sendMessage(roomId, content) {
    const text = content.trim();
    if (!text) throw new Error('메시지를 입력해 주세요.');
    await jejariApi.sendMessage(roomId, text);
    notify();
    return this.getMessages(roomId);
  },
  async completeChat(roomId) {
    await jejariApi.completeChat(roomId);
    notify();
    return this.getMessages(roomId);
  },
  async markRead() { /* No read-receipt endpoint in this specification. */ },
  subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); },
  startMockReply() { return () => {}; },
};
