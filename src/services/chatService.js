import { createMockChatRooms, createCandidateChat, mockReturnMeeting } from '../mocks/chatRooms';
import { apiEnabled } from '../api/config';
import { apiChatService } from './apiChatService';

// These are UI models, not assumed server DTOs. Replace this mock adapter with
// HTTP calls and response mapping when the backend contracts are available.
const rooms = new Map(createMockChatRooms().map((room) => [room.id, room]));
const listeners = new Set();
const replyTimers = new Map();
const clone = (value) => structuredClone(value);
let messageSequence = 10;

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

const mockChatService = {
  // The supplied specification has no chat-list endpoint yet.
  // Keep list/filter/read state behind this boundary; do not invent requests.
  async getChats({ unreadOnly = false } = {}) {
    return [...rooms.values()].filter((room) => !unreadOnly || room.unread).map((room) => ({
      id: room.id, item: clone(room.item), unread: room.unread,
      status: room.status, updatedLabel: room.updatedLabel,
    }));
  },

  // POST /chats: the existing ownership flow validates eligibility first.
  async createChat(candidate) {
    const id = 'room-' + candidate.id;
    if (!rooms.has(id)) rooms.set(id, createCandidateChat(candidate));
    notify();
    return publicRoom(getRoom(id));
  },

  // GET /chats/:chatId/messages. Room/item metadata is composed into this UI model.
  // The supplied catalog spells this parameter "char_id"; confirm its DTO later.
  async getMessages(roomId) {
    return publicRoom(getRoom(roomId));
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

export const chatService = apiEnabled ? apiChatService : mockChatService;
