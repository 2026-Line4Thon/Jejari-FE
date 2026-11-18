import { matchingListPath } from '../components/matching-flow/matchingRoutes';
import { foundMatchingListPath } from '../components/found-matching/foundMatchingRoutes';
import { chatRoomPath, chatCompletePath } from '../components/chat/chatRoutes';

export function getRegistrationBadge(item) {
  if (item.isPreview) return { label: '등록 미리보기', className: 'candidate' };
  switch (item.status) {
    case 'candidates': return { label: Number.isFinite(item.candidateCount) ? `후보 ${item.candidateCount}건` : item.statusLabel || '매칭 후보 있음', className: 'candidate' };
    case 'matching': return { label: '매칭 대기 중', className: 'candidate' };
    case 'returning': return { label: '반환 협의 중', className: 'returning' };
    case 'completed': return { label: '반환 완료', className: 'candidate' };
    default: return { label: '상태 확인 필요', className: 'candidate' };
  }
}

// The selected registration identifies the item; its status selects the flow.
// Display names and badge text are never used as route keys.
export function getRegistrationDestination(item) {
  if (item.id == null) return null;
  const state = { returnTo: '/mypage', registrationId: item.id, registrationType: item.type };
  if (item.status === 'returning' && item.chatId) return { to: chatRoomPath(item.chatId), state };
  if (item.status === 'completed') return { to: item.chatId ? chatCompletePath(item.chatId) : '/return-history', state };
  if (item.status === 'candidates' || item.status === 'matching') {
    if (item.type === 'lost') return { to: `${matchingListPath}?itemId=${encodeURIComponent(item.id)}`, state };
    if (item.type === 'found' && item.matchingItem?.id === item.id) return { to: foundMatchingListPath, state: { ...state, foundItem: item.matchingItem } };
  }
  return null;
}
