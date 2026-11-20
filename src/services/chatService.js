import { createCandidateChat, mockReturnMeeting } from '../mocks/chatRooms';
import { itemApiId, requestItemApi } from './foundItemService';
import placeholder from '../assets/recent-found/placeholder.svg';

const rooms = new Map();
const listeners = new Set();
const replyTimers = new Map();
const clone = (value) => structuredClone(value);
let messageSequence = 10;
let sessionToken;

function readChatList(data) {
  if (Array.isArray(data)) return data;
  // Accept paginated and wrapped lists as well as the documented array.
  for (const container of [data, data?.data]) {
    if (Array.isArray(container)) return container;
    for (const key of ['results', 'chat_rooms', 'chats', 'items']) {
      if (Array.isArray(container?.[key])) return container[key];
    }
  }
  throw new Error('채팅 목록 응답을 확인해 주세요.');
}

function mapApiRoom(entry) {
  const id = itemApiId(entry.chat_room_id ?? entry.id);
  const item = entry.item_summary && typeof entry.item_summary === 'object' ? entry.item_summary : {};
  const date = entry.created_at ? new Date(entry.created_at) : null;
  const dateLabel = date && !Number.isNaN(date.getTime()) ? new Intl.DateTimeFormat('ko-KR', { timeZone: 'Asia/Seoul', month: 'long', day: 'numeric' }).format(date) : '';
  return { id, candidateId: entry.candidate_id, status: String(entry.status).toUpperCase() === 'COMPLETED' ? 'completed' : 'active', unread: Number(entry.unread_count) > 0, updatedLabel: dateLabel, dateLabel,
    item: { name: item.item_name || (typeof entry.item_summary === 'string' ? entry.item_summary : '') || '등록 물품', place: item.found_location || item.place_name || '', dateLabel, photo: { source: item.blurred_image_url || item.image_url || placeholder } }, messages: [], meeting: null };
}

function getRoom(roomId) {
  const room = rooms.get(String(roomId));
  if (!room) throw new Error('채팅방을 찾을 수 없어요. 채팅 목록을 다시 확인해 주세요.');
  return room;
}

function publicRoom(room) {
  const data = clone(room);
  delete data.mockScenario;
  return data;
}

function notify() {
  listeners.forEach((listener) => listener());
}

function deliverMockReply(room) {
  if (room.status !== 'active' || room.mockScenario !== 'earbuds-return' || room.messages.some((message) => message.sender === 'other')) return;
  room.messages.push({ id: 'message-' + messageSequence++, sender: 'other', text: '네네 방금 중앙도서관 1층 안내데스크에\n맡겨두었습니다!' });
  room.updatedLabel = '방금 전';
  notify();
}

export const chatService = {
  // Message queries and mutations remain in the existing ChatRoomPage.
  async getChats({ unreadOnly = false } = {}) {
    const token = localStorage.getItem('access_token');
    if (sessionToken !== token) { rooms.clear(); sessionToken = token; }
    const data = await requestItemApi('/chats');
    if (token !== localStorage.getItem('access_token')) throw new Error('로그인 정보가 변경됐어요. 다시 확인해 주세요.');
    const entries = readChatList(data).map(mapApiRoom);
    rooms.clear();
    entries.forEach((room) => rooms.set(String(room.id), room));
    return entries.filter((room) => !unreadOnly || room.unread).map(publicRoom);
  },

  // POST /chats: the existing ownership flow validates eligibility first.
  async createChat(candidate) {
    const id = 'room-' + candidate.id;
    if (!rooms.has(id)) rooms.set(id, createCandidateChat(candidate));
    notify();
    return publicRoom(getRoom(id));
  },

  // Supply room metadata; the teammate's page loads the actual messages.
  async getMessages(roomId) {
    const id = itemApiId(roomId);
    await this.getChats();
    return publicRoom(getRoom(id));
  },

  async markRead(roomId) {
    const room = getRoom(roomId);
    if (room.unread) { room.unread = false; notify(); }
  },

  // Local subscription today; an API/query or realtime adapter can replace it.
  subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  // Fixture-only incoming delivery, cancelled when leaving the room.
  // This never sends anything to another user or a server.
  startMockReply(roomId) {
    const room = getRoom(roomId);
    if (room.mockScenario !== 'earbuds-return' || room.messages.some((message) => message.sender === 'other')) return () => {};
    const timer = setTimeout(() => { replyTimers.delete(room.id); deliverMockReply(room); }, 1800);
    clearTimeout(replyTimers.get(room.id));
    replyTimers.set(room.id, timer);
    return () => {
      if (replyTimers.get(room.id) === timer) replyTimers.delete(room.id);
      clearTimeout(timer);
    };
  },

  // POST /chats/:chatId/messages
  async sendMessage(roomId, text) {
    const room = getRoom(roomId);
    const trimmed = text.trim();
    if (!trimmed) throw new Error('메시지를 입력해 주세요.');
    if (room.status === 'completed') throw new Error('반환이 완료된 채팅이에요.');
    clearTimeout(replyTimers.get(room.id));
    replyTimers.delete(room.id);
    deliverMockReply(room);
    room.messages.push({ id: 'message-' + messageSequence++, sender: 'me', text: trimmed });
    // The meeting is explicit fixture metadata, not an AI inference or a new API.
    if (room.mockScenario === 'earbuds-return') room.meeting = clone(mockReturnMeeting);
    room.updatedLabel = '방금 전';
    notify();
    return publicRoom(room);
  },

  // POST /chats/:chatId/complete
  async completeChat(roomId) {
    const room = getRoom(roomId);
    if (!room.meeting) throw new Error('반환 장소와 시간을 확인한 뒤 완료해 주세요.');
    room.status = 'completed';
    room.unread = false;
    clearTimeout(replyTimers.get(room.id));
    replyTimers.delete(room.id);
    notify();
    return publicRoom(room);
  },
};
