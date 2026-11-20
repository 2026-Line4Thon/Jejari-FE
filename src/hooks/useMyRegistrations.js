import { useEffect, useRef, useState } from 'react';
import { myRegistrationService } from '../services/myRegistrationService';
import { getRegistrationDestination, resolveRegistrationState } from '../utils/myRegistrationNavigation';

export default function useMyRegistrations({ includeStats = true } = {}) {
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState(null);
  const [statsError, setStatsError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [pendingKey, setPendingKey] = useState(null);
  const active = useRef(false);
  const inFlight = useRef(false);
  useEffect(() => {
    active.current = true;
    let cancelled = false;
    myRegistrationService.getOngoing({ includeStats }).then((data) => {
      if (!cancelled) { setItems(includeStats ? data.items : data); setStats(includeStats ? data.stats : null); setStatsError(includeStats ? data.statsError : ''); }
    }).catch((loadError) => {
      if (!cancelled) setError(loadError.message);
    }).finally(() => { if (!cancelled) setIsLoading(false); });
    return () => { cancelled = true; active.current = false; };
  }, [includeStats]);

  const open = async (itemId, itemType, options) => {
    if (inFlight.current) return null;
    inFlight.current = true;
    setPendingKey(itemType + ':' + itemId);
    setError('');
    try {
      // Recheck the selected registration, rather than routing from stale badge text.
      const currentItem = items.find((item) => String(item.id) === String(itemId) && item.type === itemType);
      if (!currentItem) throw new Error('선택한 등록 정보를 확인할 수 없어요.');
      const status = await myRegistrationService.getProgress(itemId, currentItem.type, currentItem);
      const item = {
        ...currentItem,
        ...resolveRegistrationState(status, currentItem),
      };
      if (active.current) setItems((current) => current.map((entry) => String(entry.id) === String(item.id) && entry.type === item.type ? item : entry));
      const destination = getRegistrationDestination(item, options);
      if (!destination) throw new Error('이 등록의 연결 정보를 확인할 수 없어요. 잠시 후 다시 확인해 주세요.');
      return active.current ? destination : null;
    } catch (actionError) {
      if (active.current) setError(actionError.message);
      return null;
    } finally {
      inFlight.current = false;
      if (active.current) setPendingKey(null);
    }
  };
  return { items, stats, statsError, isLoading, error, pendingKey, open };
}
