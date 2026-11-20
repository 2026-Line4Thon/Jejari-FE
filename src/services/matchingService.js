import { chatService } from './chatService';
import { itemApiId, requestItemApi } from './foundItemService';

const checks = new Map();
const starts = new Map();
let sessionToken;
function currentSession() {
  const token = localStorage.getItem('access_token');
  if (token !== sessionToken) { checks.clear(); starts.clear(); sessionToken = token; }
  return token;
}
function checkView(check) {
  const question = check.questions[check.index];
  return { id: check.id, candidateId: check.candidateId, status: check.status, questionId: question?.question_id, question: question?.text || '', step: check.index + 1, total: check.questions.length, message: check.message, chatId: check.chatId };
}
function checkById(id) {
  currentSession();
  const check = checks.get(String(id));
  if (!check) throw new Error('소유권 확인 화면에서 질문을 다시 열어 주세요.');
  return check;
}

export const matchingService = {
  async getCandidates(id, { signal } = {}) { return requestItemApi('/items/lost/' + itemApiId(id) + '/candidates', { signal }); },
  async getCandidate(id, { signal } = {}) { return requestItemApi('/candidates/' + itemApiId(id), { signal }); },
  async rejectCandidate(id) { return requestItemApi('/candidates/' + itemApiId(id) + '/reject', { method: 'POST' }); },
  async createOwnershipCheck(candidateId) {
    const token = currentSession();
    const key = itemApiId(candidateId);
    if (!starts.has(key)) {
      const operation = requestItemApi('/candidates/' + key + '/ownership-checks', { method: 'POST' }).then((data) => {
        if (localStorage.getItem('access_token') !== token) throw new Error('인증 정보가 변경됐어요. 다시 확인해 주세요.');
        if (!data?.check_id || !data.questions?.length) throw new Error('소유권 확인 질문을 불러오지 못했어요.');
        if (String(data.candidate_id) !== key) throw new Error('선택한 후보의 질문 정보를 확인해 주세요.');
        const check = { id: data.check_id, candidateId: data.candidate_id, questions: data.questions, index: 0, answers: [], status: 'pending' };
        checks.set(String(check.id), check);
        return check.id;
      }).catch((error) => { if (starts.get(key) === operation) starts.delete(key); throw error; });
      starts.set(key, operation);
    }
    return checkView(checkById(await starts.get(key)));
  },
  async submitOwnershipAnswer(checkId, answer) {
    const check = checkById(checkId);
    if (check.status === 'locked') throw new Error('소유권 확인 시도 횟수를 초과했어요.');
    if (check.status === 'unverified') return this.createOwnershipCheck(check.candidateId);
    if (check.status !== 'pending') throw new Error('이미 소유권 판정이 완료됐어요.');
    if (!answer.trim()) throw new Error('기억나는 특징을 입력해 주세요.');
    const entry = { question_id: check.questions[check.index].question_id, answer: answer.trim() };
    if (check.index < check.questions.length - 1) {
      check.answers.push(entry); check.index += 1;
      return checkView(check);
    }
    const data = await requestItemApi('/ownership-checks/' + itemApiId(checkId) + '/answers', { method: 'POST', body: { answers: [...check.answers, entry] } });
    check.message = data.message;
    if (data.result === 'MATCHED') { check.status = 'verified'; check.chatId = data.chat_room_id; }
    else if (data.result === 'NEED_MORE' && data.questions?.length) { check.questions = data.questions; check.index = 0; check.answers = []; }
    else if (data.result === 'MISMATCH') { check.status = data.remaining_attempts === 0 ? 'locked' : 'unverified'; starts.delete(String(check.candidateId)); }
    else throw new Error('소유권 판정 응답을 확인해 주세요.');
    return checkView(check);
  },
  async skipOwnershipAnswer(id) { return this.submitOwnershipAnswer(id, '잘 모르겠어요'); },
  async getReturnConnection(candidateId, checkId) {
    const check = checkById(checkId);
    if (String(check.candidateId) !== String(candidateId) || check.status !== 'verified') throw new Error('소유권 확인을 완료한 뒤 채팅을 시작해 주세요.');
    return { verification: checkView(check) };
  },
  async createChat(candidateId, checkId) {
    const { verification } = await this.getReturnConnection(candidateId, checkId);
    if (!verification.chatId) throw new Error('반환 연결 화면에서 채팅 시작하기를 눌러 주세요.');
    return { id: verification.chatId };
  },
  async sendMessage(roomId, text) { return chatService.sendMessage(roomId, text); },
};
