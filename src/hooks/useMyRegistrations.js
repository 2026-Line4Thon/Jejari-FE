import { useEffect, useRef, useState } from 'react';
import { myRegistrationService } from '../services/myRegistrationService';
import { getRegistrationDestination } from '../utils/myRegistrationNavigation';

function normalizeStatus(status) {
  const value = String(status || '').toLowerCase();
  if (value.includes('complete')) return 'completed';
  if (value.includes('return')) return 'returning';
  if (value.includes('candidate') || value.includes('match')) return value.includes('ing') ? 'matching' : 'candidates';
  return 'matching';
}

export default function useMyRegistrations() {
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState(null);
  const [statsError, setStatsError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [pendingId, setPendingId] = useState(null);
  const active = useRef(false);
  const inFlight = useRef(false);
  useEffect(() => {
    active.current = true;
    let cancelled = false;
    myRegistrationService.getOngoing({ includeStats: true }).then((data) => {
      if (!cancelled) { setItems(data.items); setStats(data.stats); setStatsError(data.statsError); }
    }).catch((loadError) => {
      if (!cancelled) setError(loadError.message);
    }).finally(() => { if (!cancelled) setIsLoading(false); });
    return () => { cancelled = true; active.current = false; };
  }, []);

  const open = async (itemId) => {
    if (inFlight.current) return null;
    inFlight.current = true;
    setPendingId(itemId);
    setError('');
    try {
      // Recheck the selected registration, rather than routing from stale badge text.
      const currentItem = items.find((item) => String(item.id) === String(itemId));
      const status = await myRegistrationService.getStatus(itemId, currentItem?.type);
      const item = {
        ...currentItem,
        status: normalizeStatus(status.status || currentItem?.status),
        candidateCount: Number(status.candidate_count ?? status.candidates_count ?? currentItem?.candidateCount ?? 0),
        chatId: status.chat_room_id ?? status.chat_id ?? currentItem?.chatId ?? null,
      };
      const destination = getRegistrationDestination(item);
      if (!destination) throw new Error('이 등록의 연결 정보를 확인할 수 없어요. 잠시 후 다시 확인해 주세요.');
      return active.current ? destination : null;
    } catch (actionError) {
      if (active.current) setError(actionError.message);
      return null;
    } finally {
      inFlight.current = false;
      if (active.current) setPendingId(null);
    }
  };
  return { items, stats, statsError, isLoading, error, pendingId, open };
}
