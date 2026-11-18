import { chatService } from './chatService';
import { apiEnabled } from '../api/config';
import { apiMatchingService } from './apiMatchingService';
import { mockLostItem, mockMatchingCandidates, createMockOwnershipCheck } from '../mocks/matchingItems';
import { getLostRegistrationPreview } from '../mocks/lostRegistrationStore';

const rejected = new Set();
const checks = new Map();
const clone = (value) => structuredClone(value);

function candidateById(id) {
  const candidate = mockMatchingCandidates.find((item) => item.id === Number(id));
  if (!candidate || rejected.has(candidate.id)) throw new Error('매칭 후보를 찾을 수 없어요. 다른 후보를 확인해 주세요.');
  return candidate;
}

function checkById(id) {
  const check = checks.get(id);
  if (!check) throw new Error('소유권 확인 정보를 찾을 수 없어요. 질문을 다시 확인해 주세요.');
  return check;
}

// Mock methods follow the supplied API's feature boundaries. No HTTP requests.
const mockMatchingService = {
  // GET /items/lost/:itemId/candidates
  async getCandidates(lostItemId = mockLostItem.id) {
    const preview = getLostRegistrationPreview(lostItemId);
    if (preview) return { lostItem: preview, candidates: [] };
    if (Number(lostItemId) !== mockLostItem.id) throw new Error('등록한 분실물을 찾을 수 없어요.');
    return clone({ lostItem: mockLostItem, candidates: mockMatchingCandidates.filter((item) => !rejected.has(item.id)) });
  },
  // GET /candidates/:candidateId
  async getCandidate(candidateId) {
    return clone(candidateById(candidateId));
  },
  // POST /candidates/:candidateId/reject
  async rejectCandidate(candidateId) {
    const candidate = candidateById(candidateId);
    rejected.add(candidate.id);
    return { rejected: true, candidateId: candidate.id };
  },
  // POST /candidates/:candidateId/ownership-checks
  async createOwnershipCheck(candidateId) {
    const candidate = candidateById(candidateId);
    const id = 'check-' + candidate.id;
    if (!checks.has(id)) checks.set(id, createMockOwnershipCheck(candidate.id));
    return clone(checks.get(id));
  },
  // POST /ownership-checks/:checkId/answers
  async submitOwnershipAnswer(checkId, answer) {
    if (!answer.trim()) throw new Error('기억나는 특징을 입력해 주세요.');
    const check = checkById(checkId);
    candidateById(check.candidateId);
    // Fixed success fixture for the requested preview; real judgment belongs to BE.
    check.status = 'verified';
    return clone(check);
  },
  async skipOwnershipAnswer(checkId) {
    const check = checkById(checkId);
    candidateById(check.candidateId);
    check.status = 'unverified';
    return clone(check);
  },
  // GET /ownership-checks/:checkId
  async getReturnConnection(candidateId, checkId) {
    const candidate = candidateById(candidateId);
    const check = checkById(checkId);
    if (check.candidateId !== candidate.id || check.status === 'pending') throw new Error('소유권 확인 화면에서 반환 연결을 진행해 주세요.');
    return clone({ candidate, verification: check });
  },
  // POST /chats: ownership validation remains in this flow.
  async createChat(candidateId, checkId) {
    const connection = await this.getReturnConnection(candidateId, checkId);
    return chatService.createChat(connection.candidate);
  },
  // Kept as a forwarding boundary for existing matching consumers.
  async sendMessage(roomId, text) {
    return chatService.sendMessage(roomId, text);
  },
};

export const matchingService = apiEnabled ? apiMatchingService : mockMatchingService;
