import { useCallback, useRef, useState } from 'react';
import useApiResource from './useApiResource';
import { apiEnabled } from '../api/config';
import { jejariApi } from '../api/endpoints';
import { dateLabel } from '../api/mappers';

const preview = [
  { id: 1, type: 'MATCH_CANDIDATE', title: '높은 유사도의 습득물을 찾았어요', message: '검정색 무선 이어폰 · 중앙도서관 2층', time: '방금 전', is_read: false },
  { id: 2, type: 'CHAT_STARTED', title: '소유권 확인이 완료됐어요', message: '습득자와 비공개 채팅을 시작해 보세요.', time: '어제', is_read: true },
  { id: 3, type: 'WAITING', title: '등록한 분실물을 계속 찾고 있어요', message: '새 습득물이 올라오면 다시 알려드릴게요.', time: '3일 전', is_read: true },
];
export default function useNotifications() {
  const resource = useApiResource(useCallback((signal) => apiEnabled ? jejariApi.notifications({ signal }) : { notifications: preview }, []));
  const [readIds, setReadIds] = useState(new Set());
  const [actionError, setActionError] = useState('');
  const busy = useRef(false);
  const items = (resource.data?.notifications ?? []).map((item) => ({ ...item, is_read: item.is_read || readIds.has(item.id), time: item.time ?? dateLabel(item.created_at, true) }));
  const mark = async (ids) => {
    if (busy.current) return false;
    busy.current = true; setActionError('');
    try {
      const results = await Promise.allSettled(ids.map(async (id) => { if (apiEnabled) await jejariApi.readNotification(id); return id; }));
      setReadIds((previous) => new Set([...previous, ...results.filter((result) => result.status === 'fulfilled').map((result) => result.value)]));
      const failed = results.find((result) => result.status === 'rejected');
      if (failed) { setActionError(failed.reason.message); return false; }
      return true;
    } finally { busy.current = false; }
  };
  return { ...resource, items, error: resource.error || actionError, allRead: items.length > 0 && items.every((item) => item.is_read), mark, markAll: () => mark(items.filter((item) => !item.is_read).map((item) => item.id)) };
}
