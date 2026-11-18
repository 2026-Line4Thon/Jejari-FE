import { jejariApi } from '../api/endpoints';
import { authSession } from '../api/session';
import { candidateModel, lostItemModel } from '../api/mappers';
import { apiChatService } from './apiChatService';

const starts = new Map();
const checks = new Map();
let sessionVersion = 0;
authSession.subscribe(() => { sessionVersion += 1; starts.clear(); checks.clear(); });
function checkView(check) {
  const question = check.questions?.[check.index];
  return { id: check.id, candidateId: check.candidateId, status: check.status, questionId: question?.question_id, question: question?.text ?? '', step: check.index + 1, total: check.questions?.length || 1, chatId: check.chatId, message: check.message };
}

export const apiMatchingService = {
  async getCandidates(itemId) {
    if (itemId == null) {
      const response = await jejariApi.myItems('lost');
      itemId = response.items.find((item) => item.status === 'CANDIDATE_FOUND')?.id ?? response.items[0]?.id;
      if (!itemId) throw new Error('먼저 분실물을 등록해 주세요.');
    }
    const [source, data] = await Promise.all([jejariApi.lostItem(itemId), jejariApi.candidates(itemId)]);
    return { lostItem: lostItemModel(source), candidates: data.candidates.map((candidate) => ({ ...candidateModel(candidate), lostItemId: source.lost_item_id })) };
  },
  async getCandidate(id) { return candidateModel(await jejariApi.candidate(id)); },
  async rejectCandidate(id) { return jejariApi.rejectCandidate(id); },
  async createOwnershipCheck(candidateId) {
    const key = String(candidateId);
    const version = sessionVersion;
    if (!starts.has(key)) {
      const operation = jejariApi.createOwnership(candidateId).then((data) => {
      if (version !== sessionVersion) throw new Error('인증 정보가 변경됐어요. 다시 확인해 주세요.');
      if (!data.questions?.length) throw new Error('소유권 확인 질문을 불러오지 못했어요.');
      const check = { id: data.check_id, candidateId: data.candidate_id, status: 'pending', questions: data.questions, index: 0, answers: [] };
      checks.set(String(check.id), check);
      return check.id;
      }).catch((error) => { if (starts.get(key) === operation) starts.delete(key); throw error; });
      starts.set(key, operation);
    }
    const id = await starts.get(key);
    return checkView(checks.get(String(id)));
  },
  async submitOwnershipAnswer(id, answer) {
    const check = checks.get(String(id));
    if (!check) throw new Error('소유권 확인 질문을 다시 열어 주세요.');
    if (check.status === 'locked') throw new Error('소유권 확인 시도 횟수를 초과했어요.');
    if (check.status === 'unverified') return this.createOwnershipCheck(check.candidateId);
    if (!answer.trim()) throw new Error('기억나는 특징을 입력해 주세요.');
    const pending = { question_id: check.questions[check.index].question_id, answer: answer.trim() };
    if (check.index < check.questions.length - 1) {
      check.answers.push(pending);
      check.index += 1;
      return checkView(check);
    }
    const data = await jejariApi.answerOwnership(id, [...check.answers, pending]);
    check.message = data.message;
    if (data.result === 'NEED_MORE') {
      if (!data.questions?.length) throw new Error('추가 확인 질문이 응답에 없어요.');
      check.questions = data.questions; check.index = 0; check.answers = [];
    } else if (data.result === 'MATCHED') { check.status = 'verified'; check.chatId = data.chat_room_id; }
    else if (data.result === 'MISMATCH') { check.status = data.remaining_attempts === 0 ? 'locked' : 'unverified'; starts.delete(String(check.candidateId)); }
    else throw new Error('소유권 판정 결과를 확인해 주세요.');
    return checkView(check);
  },
  async skipOwnershipAnswer() { throw new Error('실제 서비스에서는 소유권 확인 후 채팅을 시작할 수 있어요.'); },
  async getReturnConnection(candidateId, checkId) {
    const [candidate, result] = await Promise.all([this.getCandidate(candidateId), jejariApi.ownership(checkId)]);
    if (String(result.candidate_id) !== String(candidateId) || result.result !== 'MATCHED') throw new Error('소유권 확인이 완료된 뒤 채팅을 시작해 주세요.');
    return { candidate, verification: { id: result.check_id, status: 'verified', chatId: result.chat_room_id } };
  },
  async createChat(candidateId, checkId) {
    const connection = await this.getReturnConnection(candidateId, checkId);
    return connection.verification.chatId ? apiChatService.getMessages(connection.verification.chatId) : apiChatService.createChat(connection.candidate);
  },
  sendMessage: (roomId, text) => apiChatService.sendMessage(roomId, text),
};
