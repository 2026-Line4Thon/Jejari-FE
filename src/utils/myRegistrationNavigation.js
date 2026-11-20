import { matchingListPath, matchingOverviewPath } from '../components/matching-flow/matchingRoutes';
import { foundMatchingListPath } from '../components/found-matching/foundMatchingRoutes';
import { chatRoomPath, chatCompletePath } from '../components/chat/chatRoutes';

export function resolveRegistrationState(detail = {}, item = {}) {
  const rawCount = detail.candidate_count ?? detail.candidates_count ?? detail.candidateCount ?? item.candidate_count ?? item.candidates_count ?? item.candidateCount;
  const count = typeof rawCount === 'number' || (typeof rawCount === 'string' && /^\d+$/.test(rawCount.trim())) ? Number(rawCount) : NaN;
  const candidateCount = Number.isSafeInteger(count) && count >= 0 ? count : null;
  const chatId = detail.chat_room_id ?? detail.chat_id ?? detail.chatId ?? item.chat_room_id ?? item.chat_id ?? item.chatId ?? null;
  const rawStatus = String(detail.status || item.status || '').trim().toUpperCase();
  let status = 'unknown';
  if (['COMPLETED', 'COMPLETE', 'RETURN_COMPLETED', 'RETURNED'].includes(rawStatus)) status = 'completed';
  else if (chatId || ['CHATTING', 'RETURNING', 'RETURN', 'RETURN_IN_PROGRESS', 'RETURN_PENDING'].includes(rawStatus)) status = 'returning';
  else if (rawStatus === 'VERIFYING' || candidateCount > 0) status = 'candidates';
  else if (candidateCount !== 0 && ['CANDIDATE_FOUND', 'CANDIDATES', 'MATCHED'].includes(rawStatus)) status = 'candidates';
  else if (['WAITING', 'MATCHING', 'PENDING', 'CANDIDATE_FOUND', 'CANDIDATES', 'MATCHED'].includes(rawStatus)) status = 'matching';
  return { status, candidateCount, chatId };
}

export function getMatchedRegistrations(items) {
  return items.filter((item) => item.status === 'candidates');
}

export function getMatchedRegistrationCount(items) {
  return getMatchedRegistrations(items).length;
}

export function getRegistrationBadge(item) {
  switch (item.status) {
    case 'candidates': return { label: item.candidateCount > 0 ? `후보 ${item.candidateCount}건` : '후보 있음', className: 'candidate' };
    case 'matching': return { label: '매칭 대기 중', className: 'candidate' };
    case 'returning': return { label: '반환 협의 중', className: 'returning' };
    case 'completed': return { label: '반환 완료', className: 'candidate' };
    default: return { label: '상태 확인 필요', className: 'candidate' };
  }
}

// The selected registration identifies the item; its status selects the flow.
// Display names and badge text are never used as route keys.
export function getRegistrationDestination(item, { returnTo = '/mypage' } = {}) {
  if (item.id == null) return null;
  const state = { returnTo: returnTo === matchingOverviewPath ? matchingOverviewPath : '/mypage', registrationId: item.id };
  if (item.status === 'returning' && item.chatId) return { to: chatRoomPath(item.chatId), state };
  if (item.status === 'completed') return { to: item.chatId ? chatCompletePath(item.chatId) : '/return-history', state };
  if (item.status === 'candidates' || item.status === 'matching') {
    if (item.type === 'lost') return { to: `${matchingListPath}?itemId=${encodeURIComponent(item.id)}`, state };
    if (item.type === 'found' && item.matchingItem?.id === item.id) return { to: foundMatchingListPath, state: { ...state, foundItem: item.matchingItem } };
  }
  return null;
}
